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
    const outApp = path.resolve(outDir, `${app.name}.app`);
    await fs.promises.rename(path.resolve(outDir, "nwjs.app"), outApp);
    if (app.icon !== undefined) {
      await fs.promises.copyFile(
        path.resolve(app.icon),
        path.resolve(outApp, "Contents", "Resources", "app.icns"),
      );
    }

    const ContentsInfoPlistPath = path.resolve(
      outApp,
      "Contents",
      "Info.plist"
    );
    const ContentsResourcesEnLprojInfoPlistStringsPath = path.resolve(
      outApp,
      "Contents",
      "Resources",
      "en.lproj",
      "InfoPlist.strings",
    );

    const ContentsInfoPlistJson = plist.parse(
      await fs.promises.readFile(
        ContentsInfoPlistPath,
        "utf-8"
      )
    );

    ContentsInfoPlistJson.LSApplicationCategoryType = app.LSApplicationCategoryType;
    ContentsInfoPlistJson.CFBundleIdentifier = app.CFBundleIdentifier;
    ContentsInfoPlistJson.CFBundleName = app.CFBundleName;
    ContentsInfoPlistJson.CFBundleDisplayName = app.CFBundleDisplayName;
    ContentsInfoPlistJson.CFBundleSpokenName = app.CFBundleSpokenName;
    ContentsInfoPlistJson.CFBundleVersion = app.CFBundleVersion;
    ContentsInfoPlistJson.CFBundleShortVersionString = app.CFBundleShortVersionString;

    Object.keys(ContentsInfoPlistJson).forEach((option) => {
      if (ContentsInfoPlistJson[option] === undefined) {
        delete ContentsInfoPlistJson[option];
      }
    });

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
