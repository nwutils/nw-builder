import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import dmg from "../../../packages/packager/src/dmg.js";

/*
 * Unlike dmg.test.js (stand-in tools), this runs the real `hdiutil`, `ditto`
 * and `codesign`, so it only runs on MacOS - see
 * .github/workflows/ci-packager.yml. A minimal app bundle stands in for a
 * NW.js build: what matters here is that the DMG mounts, and that the app in
 * it and in the update zip keeps its symbolic links and a valid signature.
 * The symbolic link lives in a plain directory under `Contents/Resources`:
 * `codesign --deep` signs anything named `.framework` as a nested bundle, and
 * rejects one without a real framework's binary and `Info.plist`.
 */
describe(
  "packager/dmg real tools test suite",
  { skip: process.platform !== "darwin" },
  function () {
    let tmpDir = "";
    let outDir = "";
    let dmgPath = "";

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-dmg-real-"),
      );
      const contents = path.join(tmpDir, "app", "Demo.app", "Contents");
      const lib = path.join(contents, "Resources", "lib");
      await fs.promises.mkdir(path.join(contents, "MacOS"), {
        recursive: true,
      });
      await fs.promises.mkdir(path.join(contents, "Resources"), {
        recursive: true,
      });
      await fs.promises.mkdir(path.join(lib, "1.0"), { recursive: true });
      await fs.promises.writeFile(path.join(lib, "1.0", "data.txt"), "data\n");
      await fs.promises.writeFile(
        path.join(contents, "Info.plist"),
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
          '<plist version="1.0"><dict>',
          "<key>CFBundleExecutable</key><string>Demo</string>",
          "<key>CFBundleIdentifier</key><string>io.github.nwutils.demo</string>",
          "<key>CFBundleName</key><string>Demo</string>",
          "<key>CFBundlePackageType</key><string>APPL</string>",
          "<key>CFBundleShortVersionString</key><string>1.2.0</string>",
          "</dict></plist>",
          "",
        ].join("\n"),
      );
      await fs.promises.writeFile(
        path.join(contents, "MacOS", "Demo"),
        "#!/bin/sh\nexit 0\n",
        { mode: 0o755 },
      );
      await fs.promises.symlink("1.0", path.join(lib, "current"));

      outDir = path.join(tmpDir, "dist");
      dmgPath = await dmg({
        appDir: path.join(tmpDir, "app"),
        appName: "Demo",
        arch: /** @type {"x64" | "arm64"} */ (process.arch),
        outDir,
        version: "1.2.0",
        signIdentity: "-",
        publish: { provider: "generic", url: "https://example.com/releases" },
      });
    });

    after(async function () {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    /**
     * Assert the app bundle at `appPath` is intact and validly signed.
     * @param {string} appPath
     * @returns {Promise<void>}
     */
    async function assertApp(appPath) {
      assert.strictEqual(
        await fs.promises.readFile(
          path.join(appPath, "Contents", "Resources", "app-update.yml"),
          "utf-8",
        ),
        'provider: "generic"\nurl: "https://example.com/releases"\n',
      );
      const current = path.join(
        appPath,
        "Contents",
        "Resources",
        "lib",
        "current",
      );
      assert.ok(
        (await fs.promises.lstat(current)).isSymbolicLink(),
        "symbolic links must stay symbolic links",
      );
      assert.strictEqual(await fs.promises.readlink(current), "1.0");
      child_process.execFileSync("codesign", [
        "--verify",
        "--deep",
        "--strict",
        appPath,
      ]);
    }

    it("creates a valid DMG with the signed app and a link to /Applications", async function () {
      assert.strictEqual(
        dmgPath,
        path.join(outDir, `Demo-${process.arch}.dmg`),
      );
      child_process.execFileSync("hdiutil", ["verify", dmgPath]);

      const mountPoint = path.join(tmpDir, "mnt");
      await fs.promises.mkdir(mountPoint);
      child_process.execFileSync("hdiutil", [
        "attach",
        "-nobrowse",
        "-readonly",
        "-mountpoint",
        mountPoint,
        dmgPath,
      ]);
      try {
        assert.strictEqual(
          await fs.promises.readlink(path.join(mountPoint, "Applications")),
          "/Applications",
        );
        await assertApp(path.join(mountPoint, "Demo.app"));
      } finally {
        child_process.execFileSync("hdiutil", ["detach", mountPoint]);
      }
    });

    it("writes an update zip that unpacks to the same signed app", async function () {
      const zipPath = path.join(outDir, `Demo-${process.arch}-mac.zip`);
      const unpackDir = path.join(tmpDir, "unpacked");
      child_process.execFileSync("ditto", ["-x", "-k", zipPath, unpackDir]);

      assert.deepStrictEqual(await fs.promises.readdir(unpackDir), [
        "Demo.app",
      ]);
      await assertApp(path.join(unpackDir, "Demo.app"));
      assert.ok(
        fs.existsSync(
          path.join(
            outDir,
            process.arch === "x64" ? "latest-mac.yml" : "latest-mac-arm64.yml",
          ),
        ),
      );
    });
  },
);
