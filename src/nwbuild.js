import { mkdir, readFile, rm } from "node:fs/promises";

import { decompress } from "./get/decompress.js";
import { download } from "./get/download.js";
import { getReleaseInfo } from "./get/getReleaseInfo.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";
import { develop } from "./run/develop.js";
import { isCached } from "./util/cache.js";
import { parse } from "./util/parse.js";
import { validate } from "./util/validate.js";

import { log } from "./log.js";

/**
 * @typedef {object} App
 * @property {string}  name                  Application name
 *                                           Linux configuration options
 * @property {string}  genericName           Generic name
 * @property {boolean} noDisplay             If true the application is not displayed
 * @property {string}  comment               Comment
 * @property {string}  icon                  Icon
 * @property {boolean} hidden                If true the application is hidden
 * @property {string}  onlyShowIn            Only show in
 * @property {string}  notShowIn             Not show in
 * @property {boolean} dBusActivatable       If true the application is dBus activatable
 * @property {string}  tryExec               Try exec
 * @property {string}  exec                  Exec
 * @property {string}  path                  Path
 * @property {string}  terminal              Terminal
 * @property {string}  actions               Actions
 * @property {string}  mimeType              Mime type
 * @property {string}  categories            Categories
 * @property {string}  implements            Implements
 * @property {string}  keywords              Keywords
 * @property {string}  startupNotify         Startup notify
 * @property {string}  startupWMClass        Startup WM class
 * @property {string}  prefersNonDefaultGPU  Prefers non default GPU
 * @property {string}  singleMainWindow      Single main window
 *                                           Windows configuration options
 * @property {string}  comments              Comments
 * @property {string}  company               Company
 * @property {string}  fileDescription       File description
 * @property {string}  fileVersion           File version
 * @property {string}  internalName          Internal name
 * @property {string}  legalCopyright        Legal copyright
 * @property {string}  legalTrademark        Legal trademark
 * @property {string}  originalFilename      Original filename
 * @property {string}  privateBuild          Private build
 * @property {string}  productName           Product name
 * @property {string}  productVersion        Product version
 * @property {string}  specialBuild          Special build
 */

/**
 * @typedef {object} Options
 * @property {string}                       srcDir       Directory to hold NW app files unless or array of file glob patterns
 * @property {"run" | "build"}              mode         Run or build application
 * @property {"latest" | "stable" | string} version      NW runtime version
 * @property {"normal" | "sdk"}             flavor       NW runtime build flavor
 * @property {"linux" | "osx" | "win"}      platform     NW supported platforms
 * @property {"ia32" | "x64"}               arch         NW supported architectures
 * @property {string}                       outDir       Directory to store build artifacts
 * @property {"./cache" | string}           cacheDir     Directory to store NW binaries
 * @property {"https://dl.nwjs.io"}         downloadUrl  URI to download NW binaries from
 * @property {"https://nwjs.io/versions"}   manifestUrl  URI to download manifest from
 * @property {App}                          app          Multi platform configuration options
 * @property {boolean}                      cache        If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean}                      zip          If true the outDir directory is zipped
 */

/**
 * Entry point for nw-builder application
 *
 * @param  {...Options}         options  Options
 * @return {Promise<undefined>}
 */
export const nwbuild = async (options) => {
  let nwDir = "";
  let nwPkg = {};
  let cached;
  let built;
  let releaseInfo = {};
  try {
    //Check if package.json exists in the srcDir
    nwPkg = JSON.parse(await readFile(`${options.srcDir}/package.json`));

    // The name property is required for NW.js applications
    if (nwPkg.name === undefined) {
      throw new Error(
        `name property is missing from ${options.srcDir}/package.json`,
      );
    }

    // The main property is required for NW.js applications
    if (nwPkg.main === undefined) {
      throw new Error(
        `main property is missing from ${options.srcDir}/package.json`,
      );
    }

    // If the nwbuild property exists in srcDir/package.json, then they take precedence
    if (typeof nwPkg.nwbuild === "object") {
      options = { ...nwPkg.nwbuild };
    }
    if (typeof nwPkg.nwbuild === "undefined") {
      log.debug(
        `nwbuild property is not defined in ${options.srcDir}/package.json`,
      );
    } else {
      throw new Error(
        `nwbuild property in the ${
          options.srcDir
        }/package.json is of type ${typeof nwPkg.nwbuild}. Expected type object.`,
      );
    }

    // Parse options, set required values to undefined and flags with default values unless specified by user
    options = await parse(options, nwPkg);

    // Variable to store nwDir file path
    nwDir = `${options.cacheDir}/nwjs${
      options.flavor === "sdk" ? "-sdk" : ""
    }-v${options.version}-${options.platform}-${options.arch}`;

    // Create cacheDir if it does not exist
    cached = await isCached(nwDir);
    if (cached === false) {
      await mkdir(nwDir, { recursive: true });
    }

    // Create outDir if it does not exist
    built = await isCached(options.outDir);
    if (built === false) {
      await mkdir(options.outDir, { recursive: true });
    }

    // Validate options.version here
    // We need to do this to get the version specific release info
    releaseInfo = await getReleaseInfo(
      options.version,
      options.cacheDir,
      options.manifestUrl,
    );

    validate(options, releaseInfo);

    // Remove cached NW binary
    if (options.cache === false && cached === true) {
      log.debug("Remove cached NW binary");
      await rm(nwDir, { force: true, recursive: true });
    }
    // Download relevant NW.js binaries
    if (cached === false) {
      log.debug("Download relevant NW.js binaries");
      await download(
        options.version,
        options.flavor,
        options.platform,
        options.arch,
        options.downloadUrl,
        options.cacheDir,
      );
      await decompress(options.platform, options.cacheDir);
      await remove(options.platform, options.cacheDir);
    }

    if (options.mode === "run") {
      await develop(options.srcDir, nwDir, options.platform, options.argv);
    }
    if (options.mode === "build") {
      await packager(
        options.srcDir,
        nwDir,
        options.outDir,
        options.platform,
        options.zip,
        releaseInfo,
        options.app,
      );
    }
  } catch (error) {
    log.error(error);
    return error;
  }
};
