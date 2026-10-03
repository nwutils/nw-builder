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

    it("throws when signKey is passed without sign", async function () {
      await assert.rejects(
        appImage({ appDir, appName: "Demo", signKey: "ABCDEF12" }),
        /"options.signKey" was passed but "options.sign" is false/,
      );
    });

    it("throws when sign is not a boolean", async function () {
      await assert.rejects(
        appImage({
          appDir,
          appName: "Demo",
          sign: /** @type {boolean} */ (/** @type {unknown} */ ("yes")),
        }),
        /Expected "options.sign" to be a boolean/,
      );
    });

    it("throws when signKey is an empty string", async function () {
      await assert.rejects(
        appImage({ appDir, appName: "Demo", sign: true, signKey: "" }),
        /Expected "options.signKey" to be a non-empty string/,
      );
    });

    it("passes --sign to appimagetool when sign is true", async function () {
      const cacheDir = path.join(tmpDir, "cache-sign");
      const outDir = path.join(tmpDir, "out-sign");
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
        sign: true,
      });

      assert.strictEqual(
        await fs.promises.readFile(outputPath, "utf-8"),
        `fake AppImage for ARCH=${appImageToolArch}\nsigned with key=default\n`,
      );
    });

    it("passes --sign-key to appimagetool when signKey is set", async function () {
      const cacheDir = path.join(tmpDir, "cache-sign-key");
      const outDir = path.join(tmpDir, "out-sign-key");
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
        sign: true,
        signKey: "ABCDEF12",
      });

      assert.strictEqual(
        await fs.promises.readFile(outputPath, "utf-8"),
        `fake AppImage for ARCH=${appImageToolArch}\nsigned with key=ABCDEF12\n`,
      );
    });

    describe("self updating", function () {
      const updateInfoFileName = util.updateInfoFileName(
        /** @type {"ia32" | "x64" | "arm64"} */ (process.arch),
      );
      const appImageFileName = `Demo-${appImageToolArch}.AppImage`;
      const githubPublish = {
        provider: /** @type {const} */ ("github"),
        owner: "nwutils",
        repo: "demo",
      };

      /**
       * Create a cache directory holding the fake `appimagetool`.
       * @param {string} name
       * @returns {Promise<string>}
       */
      async function fakeToolCacheDir(name) {
        const cacheDir = path.join(tmpDir, name);
        await fs.promises.mkdir(cacheDir, { recursive: true });
        await fs.promises.copyFile(
          fakeAppImageTool,
          path.join(cacheDir, `appimagetool-${appImageToolArch}.AppImage`),
        );
        return cacheDir;
      }

      it("throws on an unknown publish provider", async function () {
        await assert.rejects(
          appImage({
            appDir,
            appName: "Demo",
            version: "1.0.0",
            publish: /** @type {any} */ ({ provider: "s3" }),
          }),
          /Expected "options.publish.provider" to be "github" or "generic"/,
        );
      });

      it("throws when a github publish is missing repo", async function () {
        await assert.rejects(
          appImage({
            appDir,
            appName: "Demo",
            version: "1.0.0",
            publish: /** @type {any} */ ({ provider: "github", owner: "a" }),
          }),
          /Expected "options.publish.repo" to be a non-empty string/,
        );
      });

      it("throws when a generic publish url isn't http(s)", async function () {
        await assert.rejects(
          appImage({
            appDir,
            appName: "Demo",
            version: "1.0.0",
            publish: { provider: "generic", url: "file:///srv/releases" },
          }),
          /Expected "options.publish.url" to be an http\(s\) URL/,
        );
      });

      it("throws when publish is set without version", async function () {
        await assert.rejects(
          appImage({ appDir, appName: "Demo", publish: githubPublish }),
          /Expected "options.version" to be a non-empty string/,
        );
      });

      it("throws when updateInformation is true without publish", async function () {
        await assert.rejects(
          appImage({ appDir, appName: "Demo", updateInformation: true }),
          /"options.updateInformation" is true but "options.publish" is not set/,
        );
      });

      it("throws when updateInformation is an empty string", async function () {
        await assert.rejects(
          appImage({ appDir, appName: "Demo", updateInformation: "" }),
          /Expected "options.updateInformation" to be a boolean or a non-empty string/,
        );
      });

      it("embeds app-update.yml and writes the update info file", async function () {
        const cacheDir = await fakeToolCacheDir("cache-publish");
        const outDir = path.join(tmpDir, "out-publish");

        const outputPath = await appImage({
          appDir,
          appName: "Demo",
          cacheDir,
          outDir,
          version: "1.2.0",
          publish: githubPublish,
        });

        const contents = await fs.promises.readFile(outputPath, "utf-8");
        assert.strictEqual(
          contents,
          [
            `fake AppImage for ARCH=${appImageToolArch}`,
            "app-update.yml:",
            'provider: "github"',
            'owner: "nwutils"',
            'repo: "demo"',
            "",
          ].join("\n"),
        );

        const updateInfo = await fs.promises.readFile(
          path.join(outDir, updateInfoFileName),
          "utf-8",
        );
        const sha512 = await util.sha512(outputPath);
        const size = Buffer.byteLength(contents);
        assert.match(
          updateInfo,
          new RegExp(
            [
              'version: "1.2.0"',
              "files:",
              `  - url: "${appImageFileName}"`,
              `    sha512: "${sha512.replace(/[+/]/g, "\\$&")}"`,
              `    size: ${size}`,
              `path: "${appImageFileName}"`,
              `sha512: "${sha512.replace(/[+/]/g, "\\$&")}"`,
              'releaseDate: "[^"]+"',
              "",
            ].join("\n"),
          ),
        );
        assert.strictEqual(
          fs.existsSync(`${outputPath}.zsync`),
          false,
          "no .zsync file without updateInformation",
        );
      });

      it("derives gh-releases-zsync update information from a github publish", async function () {
        const cacheDir = await fakeToolCacheDir("cache-zsync-github");
        const outDir = path.join(tmpDir, "out-zsync-github");

        const outputPath = await appImage({
          appDir,
          appName: "Demo",
          cacheDir,
          outDir,
          version: "1.2.0",
          publish: githubPublish,
          updateInformation: true,
        });

        assert.match(
          await fs.promises.readFile(outputPath, "utf-8"),
          new RegExp(
            `updateinformation=gh-releases-zsync\\|nwutils\\|demo\\|latest\\|${appImageFileName}\\.zsync\n`,
          ),
        );
        assert.ok(fs.existsSync(`${outputPath}.zsync`));
      });

      it("derives zsync update information from a generic publish", async function () {
        const cacheDir = await fakeToolCacheDir("cache-zsync-generic");
        const outDir = path.join(tmpDir, "out-zsync-generic");

        const outputPath = await appImage({
          appDir,
          appName: "Demo",
          cacheDir,
          outDir,
          version: "1.2.0",
          publish: { provider: "generic", url: "https://example.com/demo/" },
          updateInformation: true,
        });

        const contents = await fs.promises.readFile(outputPath, "utf-8");
        assert.ok(
          contents.includes(
            `updateinformation=zsync|https://example.com/demo/${appImageFileName}.zsync\n`,
          ),
          contents,
        );
        assert.ok(
          contents.includes(
            'provider: "generic"\nurl: "https://example.com/demo/"\n',
          ),
          contents,
        );
      });

      it("passes an explicit updateInformation string as-is without publish", async function () {
        const cacheDir = await fakeToolCacheDir("cache-zsync-explicit");
        const outDir = path.join(tmpDir, "out-zsync-explicit");
        const explicit =
          "gh-releases-zsync|me|other|latest|Demo-*.AppImage.zsync";

        const outputPath = await appImage({
          appDir,
          appName: "Demo",
          cacheDir,
          outDir,
          updateInformation: explicit,
        });

        assert.strictEqual(
          await fs.promises.readFile(outputPath, "utf-8"),
          `fake AppImage for ARCH=${appImageToolArch}\nupdateinformation=${explicit}\n`,
        );
        assert.strictEqual(
          fs.existsSync(path.join(outDir, updateInfoFileName)),
          false,
          "no update info file without publish",
        );
      });

      it("throws when appimagetool doesn't produce the .zsync file", async function () {
        const cacheDir = await fakeToolCacheDir("cache-no-zsyncmake");
        const outDir = path.join(tmpDir, "out-no-zsyncmake");

        process.env.FAKE_APPIMAGETOOL_NO_ZSYNCMAKE = "1";
        try {
          await assert.rejects(
            appImage({
              appDir,
              appName: "Demo",
              cacheDir,
              outDir,
              version: "1.2.0",
              publish: githubPublish,
              updateInformation: true,
            }),
            /did not produce .*\.zsync\. Install "zsyncmake"/,
          );
        } finally {
          delete process.env.FAKE_APPIMAGETOOL_NO_ZSYNCMAKE;
        }
      });
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
