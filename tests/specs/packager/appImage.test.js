import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import appImage, {
  getAppImageTool,
} from "../../../packages/packager/src/appImage.js";
import util from "../../../packages/packager/src/util.js";
import testServer from "../../fixtures/packager/request.js";

const fixturesDir = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "fixtures",
  "packager",
);
const appFixtureDir = path.join(fixturesDir, "app");
const fakeAppImageTool = path.join(fixturesDir, "bin", "fake-appimagetool.js");
const appImageToolArch =
  util.APPIMAGE_ARCH_KV[/** @type {"ia32" | "x64" | "arm64"} */ (process.arch)];

describe(
  "packager/appImage",
  { skip: process.platform !== "linux" },
  function () {
    let tmpDir;
    let appDir;
    let iconPath;

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-appimage-test-"),
      );
      appDir = path.join(tmpDir, "app");
      await fs.promises.cp(appFixtureDir, appDir, { recursive: true });
      iconPath = path.join(appDir, "icon.png");

      await fs.promises.writeFile(
        path.join(appDir, "Demo.desktop"),
        [
          "[Desktop Entry]",
          "Type=Application",
          "Version=1.5",
          "Name=Demo",
          `Icon=${iconPath}`,
          "",
        ].join("\n"),
      );
    });

    after(async function () {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    it("throws when appDir does not exist", async function () {
      await assert.rejects(
        appImage({ appDir: path.join(tmpDir, "nope"), appName: "Demo" }),
        /does not exist/,
      );
    });

    it("throws when the app's executable is missing", async function () {
      await assert.rejects(
        appImage({ appDir, appName: "NotDemo" }),
        /Expected the NW.js executable to exist/,
      );
    });

    it("throws when the desktop entry file is missing", async function () {
      const noDesktopDir = path.join(tmpDir, "no-desktop");
      await fs.promises.mkdir(noDesktopDir, { recursive: true });
      await fs.promises.writeFile(path.join(noDesktopDir, "Demo"), "");

      await assert.rejects(
        appImage({ appDir: noDesktopDir, appName: "Demo" }),
        /Expected a desktop entry file to exist/,
      );
    });

    it("throws when no icon is available", async function () {
      const noIconDir = path.join(tmpDir, "no-icon");
      await fs.promises.mkdir(noIconDir, { recursive: true });
      await fs.promises.writeFile(path.join(noIconDir, "Demo"), "");
      await fs.promises.writeFile(
        path.join(noIconDir, "Demo.desktop"),
        "[Desktop Entry]\nType=Application\nName=Demo\n",
      );

      await assert.rejects(
        appImage({ appDir: noIconDir, appName: "Demo" }),
        /requires an icon/,
      );
    });

    it("throws on an unsupported architecture", async function () {
      await assert.rejects(
        appImage({
          appDir,
          appName: "Demo",
          arch: /** @type {"x64"} */ (/** @type {unknown} */ ("mips")),
        }),
        /Expected "options.arch" to be "ia32", "x64" or "arm64"/,
      );
    });

    it("assembles an AppDir and invokes appimagetool", async function () {
      const cacheDir = path.join(tmpDir, "cache");
      const outDir = path.join(tmpDir, "out");
      await fs.promises.mkdir(cacheDir, { recursive: true });
      await fs.promises.copyFile(
        fakeAppImageTool,
        path.join(cacheDir, `appimagetool-${appImageToolArch}.AppImage`),
      );

      const outputPath = await appImage({
        appDir,
        appName: "Demo",
        cacheDir,
        outDir,
      });

      assert.strictEqual(
        outputPath,
        path.join(outDir, `Demo-${appImageToolArch}.AppImage`),
      );
      assert.ok(fs.existsSync(outputPath));
      assert.strictEqual(
        await fs.promises.readFile(outputPath, "utf-8"),
        `fake AppImage for ARCH=${appImageToolArch}\n`,
      );
    });

    describe("getAppImageTool", function () {
      before(async function () {
        await new Promise((resolve, reject) => {
          testServer.on("error", reject);
          testServer.listen(8090, resolve);
        });
      });

      after(async function () {
        await new Promise((resolve) => testServer.close(resolve));
      });

      it("downloads and caches a valid binary", async function () {
        const cacheDir = path.join(tmpDir, "cache-good");

        const toolPath = await getAppImageTool({
          appImageToolArch,
          appImageToolUrl: "http://localhost:8090/good",
          cacheDir,
          cache: true,
        });

        assert.strictEqual(
          toolPath,
          path.join(cacheDir, `appimagetool-${appImageToolArch}.AppImage`),
        );
        const stat = await fs.promises.stat(toolPath);
        assert.ok(stat.mode & 0o111, "downloaded tool should be executable");
      });

      it("rejects and removes a downloaded file that isn't an ELF binary", async function () {
        const cacheDir = path.join(tmpDir, "cache-bad");

        await assert.rejects(
          getAppImageTool({
            appImageToolArch,
            appImageToolUrl: "http://localhost:8090/bad",
            cacheDir,
            cache: true,
          }),
          /does not look like an ELF binary/,
        );

        assert.strictEqual(
          fs.existsSync(
            path.join(cacheDir, `appimagetool-${appImageToolArch}.AppImage`),
          ),
          false,
        );
      });

      it("reuses a cached binary without re-validating it", async function () {
        const cacheDir = path.join(tmpDir, "cache-reuse");
        await fs.promises.mkdir(cacheDir, { recursive: true });
        const cachedPath = path.join(
          cacheDir,
          `appimagetool-${appImageToolArch}.AppImage`,
        );
        await fs.promises.writeFile(cachedPath, "not an elf binary");

        const toolPath = await getAppImageTool({
          appImageToolArch,
          appImageToolUrl: "http://localhost:8090/good",
          cacheDir,
          cache: true,
        });

        assert.strictEqual(toolPath, cachedPath);
        assert.strictEqual(
          await fs.promises.readFile(cachedPath, "utf-8"),
          "not an elf binary",
        );
      });

      it("redownloads when cache is false", async function () {
        const cacheDir = path.join(tmpDir, "cache-redownload");
        await fs.promises.mkdir(cacheDir, { recursive: true });
        const cachedPath = path.join(
          cacheDir,
          `appimagetool-${appImageToolArch}.AppImage`,
        );
        await fs.promises.writeFile(cachedPath, "not an elf binary");

        const toolPath = await getAppImageTool({
          appImageToolArch,
          appImageToolUrl: "http://localhost:8090/good",
          cacheDir,
          cache: false,
        });

        assert.strictEqual(toolPath, cachedPath);
        const contents = await fs.promises.readFile(cachedPath);
        assert.strictEqual(contents.subarray(0, 4).toString("hex"), "7f454c46");
      });
    });
  },
);
