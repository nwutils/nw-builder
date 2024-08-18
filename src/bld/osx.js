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

    const infoPlistPath = path.resolve(outApp, "Contents", "Info.plist");
    const infoPlistJson = plist.parse(await fs.promises.readFile(infoPlistPath, "utf-8"));

    const infoPlistStringsPath = path.resolve(
      outApp,
      "Contents",
      "Resources",
      "en.lproj",
      "InfoPlist.strings",
    );
    const infoPlistStringsData = await fs.promises.readFile(
      infoPlistStringsPath,
      "utf-8",
    );

    let infoPlistStringsDataArray = infoPlistStringsData.split("\n");

    infoPlistStringsDataArray.forEach((line, idx, arr) => {
      if (line.includes("NSHumanReadableCopyright")) {
        arr[idx] =
          `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`;
      }
    });

    infoPlistJson.LSApplicationCategoryType = app.LSApplicationCategoryType;
    infoPlistJson.CFBundleIdentifier = app.CFBundleIdentifier;
    infoPlistJson.CFBundleName = app.CFBundleName;
    infoPlistJson.CFBundleDisplayName = app.CFBundleDisplayName;
    infoPlistJson.CFBundleSpokenName = app.CFBundleSpokenName;
    infoPlistJson.CFBundleVersion = app.CFBundleVersion;
    infoPlistJson.CFBundleShortVersionString = app.CFBundleShortVersionString;

    Object.keys(infoPlistJson).forEach((option) => {
      if (infoPlistJson[option] === undefined) {
        delete infoPlistJson[option];
      }
    });

    await fs.promises.writeFile(infoPlistPath, plist.build(infoPlistJson));
    await fs.promises.writeFile(
      infoPlistStringsPath,
      infoPlistStringsDataArray.toString().replace(/,/g, "\n"),
    );
  } catch (error) {
    console.error(error);
  }
};
