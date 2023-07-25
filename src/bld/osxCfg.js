import { platform } from "node:process";
import { copyFile, rename, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import plist from "plist";

import { log } from "../log.js";

/**
 * @typedef {object}  OsxRc                      OSX resource configuration options
 * @property {string} name                        The name of the application
 * @property {string} icon                        The path to the icon file. It should be a .icns file.
 * @property {string} LSApplicationCategoryType   The category that best describes your app for the App Store.
 * @property {string} CFBundleIdentifier          A unique identifier for a bundle usually in reverse DNS format.
 * @property {string} CFBundleName                A user-visible short name for the bundle.
 * @property {string} CFBundleDisplayName         The user-visible name for the bundle.
 * @property {string} CFBundleSpokenName          A replacement for the app name in text-to-speech operations.
 * @property {string} CFBundleVersion             The version of the build that identifies an iteration of the bundle.
 * @property {string} CFBundleShortVersionString  The release or version number of the bundle.
 * @property {string} NSHumanReadableCopyright    A human-readable copyright notice for the bundle.
 */

/**
 * OSX specific configuration steps
 * https://developer.apple.com/documentation/bundleresources/information_property_list
 *
 * @param  {object}             app     Resource configuration options for MacOS
 * @param  {string}             outDir  The directory to hold build artifacts
 * @return {Promise<undefined>}
 */
const setOsxConfig = async (app, outDir) => {
  if (platform === "win32") {
    log.warn(
      "MacOS apps built on Windows platform do not preserve all file permissions. See #716",
    );
  }

  try {
    const outApp = resolve(outDir, `${app.name}.app`);
    await rename(resolve(outDir, "nwjs.app"), outApp);
    if (app.icon !== undefined) {
      await copyFile(
        resolve(app.icon),
        resolve(outApp, "Contents", "Resources", "app.icns"),
      );
    }

    const infoPlistPath = resolve(outApp, "Contents", "Info.plist");
    const infoPlistJson = plist.parse(await readFile(infoPlistPath, "utf-8"));

    const infoPlistStringsPath = resolve(
      outApp,
      "Contents",
      "Resources",
      "en.lproj",
      "InfoPlist.strings",
    );
    const infoPlistStringsData = await readFile(infoPlistStringsPath, "utf-8");

    let infoPlistStringsDataArray = infoPlistStringsData.split("\n");

    infoPlistStringsDataArray.forEach((line, idx, arr) => {
      if (line.includes("NSHumanReadableCopyright")) {
        arr[
          idx
        ] = `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`;
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

    await writeFile(infoPlistPath, plist.build(infoPlistJson));
    await writeFile(
      infoPlistStringsPath,
      infoPlistStringsDataArray.toString().replace(/,/g, "\n"),
    );
  } catch (error) {
    log.error(error);
  }
};

export { setOsxConfig };
