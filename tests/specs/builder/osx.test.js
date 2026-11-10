import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import * as nw from "nw";
import { parse } from "plist";

import setOsxConfig from "../../../packages/builder/src/osx.js";
import util from "../../../packages/nw-builder/src/util.js";

import rootManifest from "../../../package.json" with { type: "json" };

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

describe(
  "bld/setOsxConfig",
  { skip: process.platform !== "darwin" },
  async function () {
    const outDir = path.join(repoRoot, "tests/fixtures/builder/macos");
    const appPath = path.join(outDir, "Demo.app");
    const releaseInfo = await util.getReleaseInfo(
      rootManifest.devDependencies.nw.split("^")[1],
      util.PLATFORM_KV["darwin"],
      util.ARCH_KV["arm64"],
      path.join(repoRoot, "node_modules/nw"),
      "https://nwjs.io/versions.json",
    );
    const chromiumVersion = releaseInfo.components.chromium;
    /* Set once the app is built: the helpers live in the framework's real version directory. */
    let helperAlertsPath = "";
    let helperGPUPath = "";
    let helperRendererPath = "";
    let helperPath = "";

    before(async function () {
      /* Copy the cached NW.js into a specific `outDir`. */
      const nwDir = await nw.findpath("all", { flavor: "sdk" });
      await fs.promises.cp(nwDir, outDir, { recursive: true, force: true });

      /* Rename relevant bundles' plists and executables. */
      await setOsxConfig({
        version: releaseInfo.version,
        app: {
          name: "Demo",
          LSApplicationCategoryType: "public.app-category.utilities",
          CFBundleIdentifier: "io.nwutils.demo",
          CFBundleName: "Demo",
          CFBundleDisplayName: "Demo",
          CFBundleSpokenName: "Demo",
          CFBundleVersion: "0.0.0",
          CFBundleShortVersionString: "0.0.0",
          NSHumanReadableCopyright: "Copyright (c) 2024 NW.js Utilities",
          NSLocalNetworkUsageDescription:
            "This test application needs to access the local network for testing purposes.",
          LSFileQuarantineEnabled: false,
          protocols: ["nwbuilder-demo", "nwbuilder-demo2"],
        },
        outDir: outDir,
        releaseInfo: {
          components: {
            chromium: chromiumVersion,
          },
        },
      });

      const versionsDir = path.join(
        appPath,
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
      );
      const versionDirs = (
        await fs.promises.readdir(versionsDir, { withFileTypes: true })
      ).filter((entry) => entry.isDirectory());
      assert.strictEqual(versionDirs.length, 1, "one real version directory");
      const helpersDir = path.join(versionsDir, versionDirs[0].name, "Helpers");
      helperAlertsPath = path.join(helpersDir, "Demo Helper (Alerts).app");
      helperGPUPath = path.join(helpersDir, "Demo Helper (GPU).app");
      helperRendererPath = path.join(helpersDir, "Demo Helper (Renderer).app");
      helperPath = path.join(helpersDir, "Demo Helper.app");
    });

    after(async function () {
      await fs.promises.rm(outDir, {
        recursive: true,
        force: true,
      });
    });

    it("renames the .app files correctly", async function () {
      const appPathExists = await util.fileExists(appPath);
      assert.strictEqual(appPathExists, true);

      const helperAlertsPathExists = await util.fileExists(helperAlertsPath);
      assert.strictEqual(helperAlertsPathExists, true);

      const helperGPUPathExists = await util.fileExists(helperGPUPath);
      assert.strictEqual(helperGPUPathExists, true);

      const helperRendererPathExists =
        await util.fileExists(helperRendererPath);
      assert.strictEqual(helperRendererPathExists, true);

      const helperPathExists = await util.fileExists(helperPath);
      assert.strictEqual(helperPathExists, true);
    });

    it("registers custom URL schemes in Info.plist", async function () {
      const infoPlist = parse(
        await fs.promises.readFile(
          path.join(appPath, "Contents", "Info.plist"),
          "utf-8",
        ),
      );
      assert.deepStrictEqual(/** @type {any} */ (infoPlist).CFBundleURLTypes, [
        {
          CFBundleURLName: "io.nwutils.demo",
          CFBundleURLSchemes: ["nwbuilder-demo", "nwbuilder-demo2"],
        },
      ]);
    });

    it("renames the executables correctly", async function () {
      const appExePath = path.join(appPath, "Contents", "MacOS", "Demo");
      const appExePathExists = await util.fileExists(appExePath);
      assert.strictEqual(appExePathExists, true);

      const helperAlertsExePath = path.join(
        helperAlertsPath,
        "Contents",
        "MacOS",
        "Demo Helper (Alerts)",
      );
      const helperAlertsExePathExists =
        await util.fileExists(helperAlertsExePath);
      assert.strictEqual(helperAlertsExePathExists, true);

      const helperGPUExePath = path.join(
        helperGPUPath,
        "Contents",
        "MacOS",
        "Demo Helper (GPU)",
      );
      const helperGPUExePathExists = await util.fileExists(helperGPUExePath);
      assert.strictEqual(helperGPUExePathExists, true);

      const helperRendererExePath = path.join(
        helperRendererPath,
        "Contents",
        "MacOS",
        "Demo Helper (Renderer)",
      );
      const helperRendererExePathExists = await util.fileExists(
        helperRendererExePath,
      );
      assert.strictEqual(helperRendererExePathExists, true);

      const helperExePath = path.join(
        helperPath,
        "Contents",
        "MacOS",
        "Demo Helper",
      );
      const helperExePathExists = await util.fileExists(helperExePath);
      assert.strictEqual(helperExePathExists, true);
    });

    /*
     * Repro for https://github.com/nwjs/nw.js/issues/8371: since NW.js
     * v0.113.0 the framework's version folder hasn't matched the Chromium
     * version in versions.json, which is why the builder renames the helpers
     * through the real version directory. A todo test reports the result without
     * failing CI while the issue is open.
     */
    it(
      "names the framework version folder after versions.json's Chromium",
      { todo: "https://github.com/nwjs/nw.js/issues/8371" },
      async function () {
        const versionsDir = path.join(
          appPath,
          "Contents",
          "Frameworks",
          "nwjs Framework.framework",
          "Versions",
        );
        const folders = (await fs.promises.readdir(versionsDir)).filter(
          (folder) => folder !== "Current",
        );
        console.log(
          `nw.js#8371: NW.js ${releaseInfo.version} versions.json Chromium ${chromiumVersion}, framework version folder(s) ${folders.join(", ")}`,
        );
        assert.deepStrictEqual(folders, [chromiumVersion]);
      },
    );

    it("", async function () {
      const ContentsInfoPlistPath = path.resolve(
        appPath,
        "Contents",
        "Info.plist",
      );
      const ContentsInfoPlistJson = parse(
        await fs.promises.readFile(ContentsInfoPlistPath, "utf-8"),
      );
      assert.strictEqual(
        ContentsInfoPlistJson.LSApplicationCategoryType,
        "public.app-category.utilities",
      );
      assert.strictEqual(
        ContentsInfoPlistJson.CFBundleIdentifier,
        "io.nwutils.demo",
      );
      assert.strictEqual(ContentsInfoPlistJson.CFBundleName, "Demo");
      assert.strictEqual(ContentsInfoPlistJson.CFBundleDisplayName, "Demo");
      assert.strictEqual(ContentsInfoPlistJson.CFBundleSpokenName, "Demo");
      assert.strictEqual(ContentsInfoPlistJson.CFBundleVersion, "0.0.0");
      assert.strictEqual(
        ContentsInfoPlistJson.CFBundleShortVersionString,
        "0.0.0",
      );
      assert.strictEqual(ContentsInfoPlistJson.CFBundleExecutable, "Demo");
      assert.strictEqual(
        ContentsInfoPlistJson.NSLocalNetworkUsageDescription,
        "This test application needs to access the local network for testing purposes.",
      );
      assert.strictEqual(ContentsInfoPlistJson.LSFileQuarantineEnabled, false);

      const HelperAlertsAppJson = parse(
        await fs.promises.readFile(
          path.resolve(helperAlertsPath, "Contents", "Info.plist"),
          "utf-8",
        ),
      );

      assert.strictEqual(
        HelperAlertsAppJson.CFBundleDisplayName,
        "Demo Helper (Alerts)",
      );
      assert.strictEqual(
        HelperAlertsAppJson.CFBundleName,
        "Demo Helper (Alerts)",
      );
      assert.strictEqual(
        HelperAlertsAppJson.CFBundleIdentifier,
        "io.nwutils.demo.helper.alert",
      );
      assert.strictEqual(
        HelperAlertsAppJson.CFBundleExecutable,
        "Demo Helper (Alerts)",
      );
      assert.strictEqual(HelperAlertsAppJson.LSFileQuarantineEnabled, false);

      const HelperGpuAppJson = parse(
        await fs.promises.readFile(
          path.resolve(helperGPUPath, "Contents", "Info.plist"),
          "utf-8",
        ),
      );

      assert.strictEqual(
        HelperGpuAppJson.CFBundleDisplayName,
        "Demo Helper (GPU)",
      );
      assert.strictEqual(HelperGpuAppJson.CFBundleName, "Demo Helper (GPU)");
      assert.strictEqual(
        HelperGpuAppJson.CFBundleIdentifier,
        "io.nwutils.demo.helper.gpu",
      );
      assert.strictEqual(
        HelperGpuAppJson.CFBundleExecutable,
        "Demo Helper (GPU)",
      );
      assert.strictEqual(HelperGpuAppJson.LSFileQuarantineEnabled, false);

      const HelperRendererAppJson = parse(
        await fs.promises.readFile(
          path.resolve(helperRendererPath, "Contents", "Info.plist"),
          "utf-8",
        ),
      );

      assert.strictEqual(
        HelperRendererAppJson.CFBundleDisplayName,
        "Demo Helper (Renderer)",
      );
      assert.strictEqual(
        HelperRendererAppJson.CFBundleName,
        "Demo Helper (Renderer)",
      );
      assert.strictEqual(
        HelperRendererAppJson.CFBundleIdentifier,
        "io.nwutils.demo.helper.renderer",
      );
      assert.strictEqual(
        HelperRendererAppJson.CFBundleExecutable,
        "Demo Helper (Renderer)",
      );
      assert.strictEqual(HelperRendererAppJson.LSFileQuarantineEnabled, false);

      const HelperAppJson = parse(
        await fs.promises.readFile(
          path.resolve(helperPath, "Contents", "Info.plist"),
          "utf-8",
        ),
      );

      assert.strictEqual(HelperAppJson.CFBundleDisplayName, "Demo Helper");
      assert.strictEqual(HelperAppJson.CFBundleName, "Demo Helper");
      assert.strictEqual(
        HelperAppJson.CFBundleIdentifier,
        "io.nwutils.demo.helper",
      );
      assert.strictEqual(HelperAppJson.CFBundleExecutable, "Demo Helper");
      assert.strictEqual(HelperAppJson.LSFileQuarantineEnabled, false);
    });
  },
);
