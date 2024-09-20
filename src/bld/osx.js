import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import plist from 'plist';

/**
 * Function to update Helper App Plist Files
 * @param {string} plistPath             - Path to Helper App Plist File
 * @param {string} helperName            - Helper App Name
 * @param {string} helperId              - Helper App ID
 * @param {string} appCFBundleIdentifier - options.app.CFBundleIdentifier
 */
async function updateHelperPlist (plistPath, helperName, helperId, appCFBundleIdentifier) {
  const plistFullPath = path.resolve(plistPath, 'Contents/Info.plist');
  const plistJson = plist.parse(await fs.promises.readFile(plistFullPath, 'utf-8'));
  plistJson.CFBundleDisplayName = helperName;
  plistJson.CFBundleName = helperName;
  plistJson.CFBundleExecutable = helperName;
  plistJson.CFBundleIdentifier = `${appCFBundleIdentifier}.${helperId}`;
  await fs.promises.writeFile(plistFullPath, plist.build(plistJson));
}

/**
 *
 * @param {object} options              - Options.
 * @param {object} options.app          - Application configuration.
 * @param {string} options.outDir       - Output directory.
 * @param {string} options.releaseInfo  - Release information.
 * @returns {Promise<void>}             - Promise.
 */
export default async function setOsxConfig({ app, outDir, releaseInfo }) {
  if (process.platform === 'win32') {
    console.warn(
      'MacOS apps built on Windows platform do not preserve all file permissions. See #716',
    );
  }

  try {
    /**
     * @type {string | null}
     */
    const chromiumVersion = releaseInfo?.components?.chromium;
    if (!chromiumVersion) {
      throw new Error('Chromium version is missing.');
    }
    /**
     * Path to MacOS application.
     * @type {string}
     */
    const nwjsApp = path.resolve(outDir, 'nwjs.app');

    /**
     * Path to renamed MacOS application.
     * @type {string}
     */
    const outApp = path.resolve(outDir, `${app.name}.app`);

    /* Rename `nwjs.app` to `${app.name}.app` */
    await fs.promises.rename(nwjsApp, outApp);

    /* Rename `Contents/MacOS/nwjs` to `Contents/MacOS/${app.name}` */
    await fs.promises.rename(
      path.resolve(outApp, 'Contents', 'MacOS', 'nwjs'),
      path.resolve(outApp, 'Contents', 'MacOS', app.name),
    );

    /* Rename all Helper apps */
    const helperBaseDir = path.resolve(
      outApp,
      'Contents/Frameworks/nwjs Framework.framework/Versions',
      chromiumVersion,
      'Helpers/'
    );

    const helperApps = [
      { name: 'nwjs Helper (Alerts).app', id: 'helper.alert' },
      { name: 'nwjs Helper (GPU).app', id: 'helper.gpu' },
      { name: 'nwjs Helper (Plugin).app', id: 'helper.plugin' },
      { name: 'nwjs Helper (Renderer).app', id: 'helper.renderer' },
      { name: 'nwjs Helper.app', id: 'helper' },
    ];

    for (const helperApp of helperApps) {
      const newHelperAppName = helperApp.name.replace(/^nwjs/, app.name);
      const oldPath = path.resolve(helperBaseDir, helperApp.name);
      const newPath = path.resolve(helperBaseDir, newHelperAppName);

      // Rename Helper base directory
      await fs.promises.rename(oldPath, newPath);

      // Rename Helper sub-directory
      const helperBaseName = helperApp.name.replace(/.app$/, '');
      const subPathBase = path.resolve(newPath, 'Contents/MacOS/');
      const oldSubPath = path.resolve(subPathBase, helperBaseName);
      const newSubPath = path.resolve(subPathBase, helperBaseName.replace(/^nwjs/, app.name));
      await fs.promises.rename(oldSubPath, newSubPath);

      // Update Helper Plist file
      await updateHelperPlist(newPath, newHelperAppName.replace(/.app$/, ''), helperApp.id, app.CFBundleIdentifier);
    }

    /* Replace default icon with user defined icon if specified. */
    if (app.icon !== undefined) {
      await fs.promises.copyFile(
        path.resolve(app.icon),
        path.resolve(outApp, 'Contents', 'Resources', 'app.icns'),
      );
    }

    /**
     * Path to `nwjs.app/Contents/Info.plist`
     * @type {string}
     */
    const contentsInfoPlistPath = path.resolve(
      outApp,
      'Contents',
      'Info.plist'
    );

    /**
     * Path to `nwjs.app/Contents/Resources/en.lproj/InfoPlist.settings`
     * @type {string}
     */
    const contentsResourcesEnLprojInfoPlistStringsPath = path.resolve(
      outApp,
      'Contents',
      'Resources',
      'en.lproj',
      'InfoPlist.strings',
    );

    /**
     * JSON from `nwjs.app/Contents/Info.plist`
     * @type {object}
     */
    const contentsInfoPlistJson = plist.parse(
      await fs.promises.readFile(
        contentsInfoPlistPath,
        'utf-8'
      )
    );

    /* Update Plist with user defined values. */
    contentsInfoPlistJson.LSApplicationCategoryType = app.LSApplicationCategoryType;
    contentsInfoPlistJson.CFBundleIdentifier = app.CFBundleIdentifier;
    contentsInfoPlistJson.CFBundleName = app.CFBundleName;
    contentsInfoPlistJson.CFBundleDisplayName = app.CFBundleDisplayName;
    contentsInfoPlistJson.CFBundleSpokenName = app.CFBundleSpokenName;
    contentsInfoPlistJson.CFBundleVersion = app.CFBundleVersion;
    contentsInfoPlistJson.CFBundleShortVersionString = app.CFBundleShortVersionString;
    contentsInfoPlistJson.CFBundleExecutable = app.name;
    contentsInfoPlistJson.NSLocalNetworkUsageDescription = app.NSLocalNetworkUsageDescription;

    /* Remove properties that were not updated by the user. */
    Object.keys(contentsInfoPlistJson).forEach((option) => {
      if (contentsInfoPlistJson[option] === undefined) {
        delete contentsInfoPlistJson[option];
      }
    });

    /**
     * Data from `nwjs.app/Contents/Resources/en.lproj/InfoPlist.settings`
     * @type {string[]}
     */
    const contentsResourcesEnLprojInfoPlistStringsArray = (await fs.promises.readFile(
      contentsResourcesEnLprojInfoPlistStringsPath,
      'utf-8',
    )).split('\n');
    contentsResourcesEnLprojInfoPlistStringsArray.forEach((line, idx, arr) => {
      if (line.includes('NSHumanReadableCopyright')) {
        arr[idx] =
          `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`;
      }
    });

    /* Write the updated values to their config files. */
    await fs.promises.writeFile(
      contentsInfoPlistPath,
      plist.build(contentsInfoPlistJson));
    await fs.promises.writeFile(
      contentsResourcesEnLprojInfoPlistStringsPath,
      contentsResourcesEnLprojInfoPlistStringsArray.toString().replace(/,/g, '\n'),
    );

  } catch (error) {
    console.error(error);
  }
};
