import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import build from "@nwutils/builder";
import get from "@nwutils/getter";

import nsis from "../../../packages/packager/src/nsis.js";
import util from "../../../packages/nw-builder/src/util.js";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

/*
 * Unlike nsis.test.js (fake app + fake makensis), this builds a real NW.js
 * Windows application, packages it with the real `makensis`, then runs the
 * installer and uninstaller silently and checks what they leave behind. That
 * means a real NW.js download and changes to the current user's registry and
 * Start Menu, so it's run through the "test:real" script, and only on Windows
 * CI runners - see .github/workflows/ci-packager.yml.
 */
describe(
  "packager/nsis real app test suite",
  { skip: process.platform !== "win32" },
  async () => {
    const cacheDir = path.join(repoRoot, "tests/fixtures/packager/cache");
    const outDir = path.join(repoRoot, "tests/fixtures/packager/out/Demo");
    const distDir = path.join(repoRoot, "tests/fixtures/packager/dist");
    /* Unique, so a leftover registry entry from an earlier run can't affect this one. */
    const appId = `nwutils-packager-test-${process.pid}`;
    const uninstallKey = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${appId}`;

    const nwOptions = {
      version: "0.115.0",
      flavor: "normal",
      platform: util.PLATFORM_KV[process.platform],
      arch: util.ARCH_KV[process.arch],
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions.json",
      cacheDir,
      cache: true,
      ffmpeg: false,
      nativeAddon: false,
      shaSum: true,
    };

    let installerPath;
    let installDir;

    before(async () => {
      await get(nwOptions);

      await build({
        ...nwOptions,
        srcDir: path.join(repoRoot, "tests/fixtures/packager/real-app"),
        outDir,
        app: {
          name: "Demo",
          company: "nwutils",
          fileDescription: "Demo",
          fileVersion: "1.0.0",
          internalName: "Demo",
          originalFilename: "Demo.exe",
          productName: "Demo",
          productVersion: "1.0.0",
          languageCode: 1033,
        },
        glob: false,
        managedManifest: false,
        zip: false,
        releaseInfo: {},
      });

      installerPath = await nsis({
        appDir: outDir,
        appName: "Demo",
        version: "1.0.0",
        arch: nwOptions.arch,
        outDir: distDir,
        appId,
        publisher: "nwutils",
      });

      installDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-real-nsis-"),
      );
    });

    after(async () => {
      child_process.spawnSync("reg", ["delete", uninstallKey, "/f"]);
      await fs.promises.rm(path.join(repoRoot, "tests/fixtures/packager/out"), {
        recursive: true,
        force: true,
      });
      await fs.promises.rm(distDir, { recursive: true, force: true });
      if (installDir !== undefined) {
        await fs.promises.rm(installDir, { recursive: true, force: true });
      }
    });

    it("produces a real installer", async () => {
      const magic = await fs.promises.readFile(installerPath);
      assert.strictEqual(magic.subarray(0, 2).toString(), "MZ");
    });

    it("installs and uninstalls silently", async () => {
      /* `/D=` must be last and unquoted, even if the path has spaces. */
      const install = child_process.spawnSync(installerPath, [
        "/S",
        `/D=${installDir}`,
      ]);
      assert.strictEqual(install.status, 0, "installer failed");

      assert.ok(fs.existsSync(path.join(installDir, "Demo.exe")));
      assert.ok(fs.existsSync(path.join(installDir, "Uninstall.exe")));

      const query = child_process.spawnSync(
        "reg",
        ["query", uninstallKey, "/v", "DisplayVersion"],
        { encoding: "utf-8" },
      );
      assert.strictEqual(query.status, 0, "uninstall key is missing");
      assert.match(query.stdout, /1\.0\.0/);

      /*
       * Without `_?=` the uninstaller copies itself to a temporary directory
       * and returns immediately. With it, it runs in place and is waited for -
       * but can't delete itself, so Uninstall.exe is left behind.
       */
      const uninstall = child_process.spawnSync(
        path.join(installDir, "Uninstall.exe"),
        ["/S", `_?=${installDir}`],
      );
      assert.strictEqual(uninstall.status, 0, "uninstaller failed");

      assert.deepStrictEqual(await fs.promises.readdir(installDir), [
        "Uninstall.exe",
      ]);
      assert.notStrictEqual(
        child_process.spawnSync("reg", ["query", uninstallKey]).status,
        0,
        "uninstall key was not removed",
      );
    });
  },
);
