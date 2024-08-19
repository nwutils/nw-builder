import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import plist from 'plist';

export default async function setOsxConfig({ outDir, app }) {
  if (process.platform === "win32") {
    console.warn(
      "MacOS apps built on Windows platform do not preserve all file permissions. See #716",
    );
  }

  try {
    /**
     * Path to MacOS application.
     *
     * @type {string}
     */
    const nwjsApp = path.resolve(outDir, 'nwjs.app');

    /**
     * Path to renamed MacOS application.
     *
     * @type {string}
     */
    const outApp = path.resolve(outDir, `${app.name}.app`);

    const HelperAlertsAppPath = path.resolve(
      outApp,
      "Contents",
      "Frameworks",
      "nwjs Frameworks.framework",
      "Helpers",
      `${app.name} Helper (Alerts).app`,
    );

    const HelperGpuAppPath = path.resolve(
      outApp,
      "Contents",
      "Frameworks",
      "nwjs Frameworks.framework",
      "Helpers",
      `${app.name} Helper (GPU).app`,
    );

    const HelperPluginAppPath = path.resolve(
      outApp,
      "Contents",
      "Frameworks",
      "nwjs Frameworks.framework",
      "Helpers",
      `${app.name} Helper (Plugin).app`,
    );

    const HelperRendererAppPath = path.resolve(
      outApp,
      "Contents",
      "Frameworks",
      "nwjs Frameworks.framework",
      "Helpers",
      `${app.name} Helper (Renderer).app`,
    );

    const HelperAppPath = path.resolve(
      outApp,
      "Contents",
      "Frameworks",
      "nwjs Frameworks.framework",
      "Helpers",
      `${app.name} Helper.app`,
    );

    /* Rename `nwjs.app` to `${app.name}.app` */
    await fs.promises.rename(nwjsApp, outApp);

    /* Rename `Contents/MacOS/nwjs` to `Contents/MacOS/${app.name}` */
    await fs.promises.rename(
      path.resolve(outApp, "Contents", "MacOS", "nwjs"),
      path.resolve(outApp, "Contents", "MacOS", app.name),
    );

    /* Rename `${app.name} Helper (Alerts)/Contents/MacOS/nwjs Helper (Alerts)` to `${app.name} Helper (Alerts)/Contents/MacOS/${app.name} Helper (Alerts)` */
    await fs.promises.rename(
      path.resolve(HelperAlertsAppPath, "Contents", "MacOS", "nwjs Helper (Alerts)"),
      path.resolve(HelperAlertsAppPath, "Contents", "MacOS", `${app.name} Helper (Alerts)`),
    );

    /* Rename `${app.name} Helper (GPU)/Contents/MacOS/nwjs Helper (GPU)` to `${app.name} Helper (GPU)/Contents/MacOS/${app.name} Helper (GPU)` */
    await fs.promises.rename(
      path.resolve(HelperGpuAppPath, "Contents", "MacOS", "nwjs Helper (GPU)"),
      path.resolve(HelperGpuAppPath, "Contents", "MacOS", `${app.name} Helper (GPU)`),
    );

    /* Rename `${app.name} Helper (Plugin)/Contents/MacOS/nwjs Helper (Plugin)` to `${app.name} Helper (Plugin)/Contents/MacOS/${app.name} Helper (Plugin)` */
    await fs.promises.rename(
      path.resolve(HelperPluginAppPath, "Contents", "MacOS", "nwjs Helper (Plugin)"),
      path.resolve(HelperPluginAppPath, "Contents", "MacOS", `${app.name} Helper (Plugin)`),
    );

    /* Rename `${app.name} Helper (Renderer)/Contents/MacOS/nwjs Helper (Renderer)` to `${app.name} Helper (Renderer)/Contents/MacOS/${app.name} Helper (Renderer)` */
    await fs.promises.rename(
      path.resolve(HelperRendererAppPath, "Contents", "MacOS", "nwjs Helper (Renderer)"),
      path.resolve(HelperRendererAppPath, "Contents", "MacOS", `${app.name} Helper (Renderer)`),
    );

    /* Rename `${app.name} Helper/Contents/MacOS/nwjs Helper` to `${app.name} Helper/Contents/MacOS/${app.name} Helper` */
    await fs.promises.rename(
      path.resolve(HelperAppPath, "Contents", "MacOS", "nwjs Helper"),
      path.resolve(HelperAppPath, "Contents", "MacOS", `${app.name} Helper`),
    );

    /* Replace default icon with user defined icon if specified. */
    if (app.icon !== undefined) {
      await fs.promises.copyFile(
        path.resolve(app.icon),
        path.resolve(outApp, "Contents", "Resources", "app.icns"),
      );
    }

    /**
     * Path to `nwjs.app/Contents/Info.plist`
     *
     * @type {string}
     */
    const ContentsInfoPlistPath = path.resolve(
      outApp,
      "Contents",
      "Info.plist"
    );

    /**
     * Path to `nwjs.app/Contents/Resources/en.lproj/InfoPlist.settings`
     *
     * @type {string}
     */
    const ContentsResourcesEnLprojInfoPlistStringsPath = path.resolve(
      outApp,
      "Contents",
      "Resources",
      "en.lproj",
      "InfoPlist.strings",
    );

    /**
     * JSON from `nwjs.app/Contents/Info.plist`
     *
     * @type {object}
     */
    const ContentsInfoPlistJson = plist.parse(
      await fs.promises.readFile(
        ContentsInfoPlistPath,
        "utf-8"
      )
    );

    /**
     * JSON from `nwjs.app/Contents/Frameworks/nwjs Frameworks.framework/Helpers/${app.name} Helper.app/Contents/Info.plist`
     *
     * @type {object}
     */
    const HelperAlertsAppJson = plist.parse(
      await fs.promises.readFile(
        HelperAlertsAppPath,
        "utf-8"
      )
    );

    /* Update Plist with user defined values. */
    ContentsInfoPlistJson.LSApplicationCategoryType = app.LSApplicationCategoryType;
    ContentsInfoPlistJson.CFBundleIdentifier = app.CFBundleIdentifier;
    ContentsInfoPlistJson.CFBundleName = app.CFBundleName;
    ContentsInfoPlistJson.CFBundleDisplayName = app.CFBundleDisplayName;
    ContentsInfoPlistJson.CFBundleSpokenName = app.CFBundleSpokenName;
    ContentsInfoPlistJson.CFBundleVersion = app.CFBundleVersion;
    ContentsInfoPlistJson.CFBundleShortVersionString = app.CFBundleShortVersionString;
    ContentsInfoPlistJson.CFBundleExecutable = app.name;

    /* Remove properties that were not updated by the user. */
    Object.keys(ContentsInfoPlistJson).forEach((option) => {
      if (ContentsInfoPlistJson[option] === undefined) {
        delete ContentsInfoPlistJson[option];
      }
    });

    /**
     * Data from `nwjs.app/Contents/Resources/en.lproj/InfoPlist.settings`
     *
     * @type {string[]}
     */
    const ContentsResourcesEnLprojInfoPlistStringsArray = (await fs.promises.readFile(
      ContentsResourcesEnLprojInfoPlistStringsPath,
      "utf-8",
    )).split('\n');
    ContentsResourcesEnLprojInfoPlistStringsArray.forEach((line, idx, arr) => {
      if (line.includes("NSHumanReadableCopyright")) {
        arr[idx] =
          `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`;
      }
    });

    /* Write the updated values to their config files. */
    await fs.promises.writeFile(
      ContentsInfoPlistPath,
      plist.build(ContentsInfoPlistJson));
    await fs.promises.writeFile(
      ContentsResourcesEnLprojInfoPlistStringsPath,
      ContentsResourcesEnLprojInfoPlistStringsArray.toString().replace(/,/g, "\n"),
    );
  } catch (error) {
    console.error(error);
  }
};
