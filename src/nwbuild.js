import { platform, arch } from "node:process";
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
 * Entry point for nw-builder application
 *
 * @param  {object}                       options              Directory to hold NW app files unless or array of file glob patterns
 * @param  {"run" | "build"}              options.mode         Run or build application
 * @param  {"latest" | "stable" | string} options.version      NW runtime version
 * @param  {"normal" | "sdk"}             options.flavor       NW runtime build flavor
 * @param  {"linux" | "osx" | "win"}      options.platform     NW supported platforms
 * @param  {"ia32" | "x64"}               options.arch         NW supported architectures
 * @param  {string}                       options.outDir       Directory to store build artifacts
 * @param  {"./cache" | string}           options.cacheDir     Directory to store NW binaries
 * @param  {"https://dl.nwjs.io"}         options.downloadUrl  URI to download NW binaries from
 * @param  {"https://nwjs.io/versions"}   options.manifestUrl  URI to download manifest from
 * @param  {object}                       options.app          Multi platform configuration options
 * @param  {boolean}                      options.cache        If true the existing cache is used. Otherwise it removes and redownloads it.
 * @param  {boolean}                      options.zip          If true the outDir directory is zipped
 * @return {Promise<undefined>}
 */
export const nwbuild = async (options) => {
  let nwDir = "";
  let nwPkg = {};
  let cached;
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

    // Validate options.version here
    // We need to do this to get the version specific release info
    releaseInfo = await getReleaseInfo(
      options.version,
      options.cacheDir,
      options.manifestUrl,
    );

    validate(options, releaseInfo);

    // Download relevant NW.js binaries
    if (options.cache === false || cached === false) {
      log.debug("Remove cached NW binary");
      await rm(nwDir, { force: true, recursive: true });
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

    if (options.mode !== "run" && options.mode !== "build") {
      throw new Error("Invalid mode value. Expected run or build.");
    }
    if (options.mode === "run") {
      await develop(options.srcDir, nwDir, options.platform);
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
