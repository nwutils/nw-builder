import { platform } from "node:process";
import fs from "node:fs/promises";
import path from "node:path";

import plist from "plist";

import { log } from "../log.js";

/**
 * OSX specific configuration steps
 *
 * @param  {object}             pkg     The srcDir/package.json as a JSON
 * @param  {string}             outDir  The directory to hold build artifacts
 * @return {Promise<undefined>}
 */
const setOsxConfig = async (pkg, outDir) => {
  if (platform === "win32") {
    log.warn("MacOS apps built on Windows platform do not preserve all file permissions. See #716");
  }
  try {
    const outApp = path.resolve(outDir, `${pkg.name}.app`);
    await fs.rename(path.resolve(outDir, "nwjs.app"), outApp);

    // Rename CFBundleDisplayName in Contents/Info.plist
    const contentsInfoPlistPath = path.resolve(outApp, "Contents/Info.plist");
    const contentsInfoPlistJson = plist.parse(
      await fs.readFile(contentsInfoPlistPath, "utf-8"),
    );
    contentsInfoPlistJson.CFBundleDisplayName = pkg.name;
    const contentsInfoPlist = plist.build(contentsInfoPlistJson);
    await fs.writeFile(contentsInfoPlistPath, contentsInfoPlist);

    // Rename CFBundleDisplayName in Contents/Resources/en.lproj/InfoPlist.strings
    const contentsInfoPlistStringsPath = path.resolve(
      outApp,
      "Contents/Resources/en.lproj/InfoPlist.strings",
    );
    const contentsInfoPlistStrings = await fs.readFile(
      contentsInfoPlistStringsPath,
      "utf-8",
    );
    const newPlistStrings = contentsInfoPlistStrings.replace(
      /CFBundleGetInfoString = "nwjs /,
      `CFBundleGetInfoString = "${pkg.name} `,
    );
    await fs.writeFile(contentsInfoPlistStringsPath, newPlistStrings);

    // Add product_string property to package.json
    // const packageJsonPath = path.resolve(outApp, "Contents/Resources/app.nw/package.json");
    // pkg.product_string = pkg.name;
    // await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 4));
  } catch (error) {
    log.error(error);
  }
};

export { setOsxConfig };
