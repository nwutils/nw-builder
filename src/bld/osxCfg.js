import { platform } from "node:process";
import fs from "node:fs/promises";
import { resolve } from "node:path";

import plist from "plist";

import { log } from "../log.js";

/**
 * @typedef {object}  OsxRc                      OSX resource configuration options
 * @property {string} LSApplicationCategoryType  The category that best describes your app for the App Store.
 * @property {string} CFBundleIdentifier         A unique identifier for a bundle usually in reverse DNS format.
 * @property {string} CFBundleName               A user-visible short name for the bundle.
 * @property {string} CFBundleDisplayName        The user-visible name for the bundle.
 * @property {string} CFBundleSpokenName         A replacement for the app name in text-to-speech operations.
 * @property {string} CFBundleVersion            The version of the build that identifies an iteration of the bundle.
 * @property {string} CFBundleShortVersionString The release or version number of the bundle.
 * @property {string} NSHumanReadableCopyright   A human-readable copyright notice for the bundle.
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
      "MacOS apps built on Windows platform do not preserve all file permissions. See #716"
    );
  }
  try {
    const outApp = resolve(outDir, `${app.name}.app`);
    await fs.rename(resolve(outDir, "nwjs.app"), outApp);

    const infoPlistPath = resolve(outApp, "Contents/Info.plist");
    const infoPlistJson = plist.parse(
      await fs.readFile(infoPlistPath, "utf-8")
    );

    infoPlistJson.CFBundleDisplayName = app.name;

    await fs.writeFile(infoPlistPath, plist.build(infoPlistJson));
  } catch (error) {
    log.error(error);
  }
};

export { setOsxConfig };
