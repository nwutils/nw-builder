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
import { getArch } from "./util/arch.js";
import { getPlatform } from "./util/platform.js";

import { log } from "./log.js";

/**
 * Entry point for nw-builder application
 *
 * @param  {object}                       options              lorem ipsum
 * @param  {"run" | "build"}              options.mode         lorem ipsum
 * @param  {"latest" | "stable" | string} options.version      lorem ipsum
 * @param  {"normal" | "sdk"}             options.flavour      lorem ipsum
 * @param  {"normal" | "sdk"}             options.flavor       lorem ipsum
 * @param  {"linux" | "osx" | "win"}      options.platform     lorem ipsum
 * @param  {"ia32" | "x64"}               options.arch         lorem ipsum
 * @param  {string}                       options.outDir       lorem ipsum
 * @param  {"./cache" | string}           options.cacheDir     lorem ipsum
 * @param  {"https://dl.nwjs.io"}         options.downloadUrl  lorem ipsum
 * @param  {"https://nwjs.io/versions"}   options.manifestUrl  lorem ipsum
 * @param  {boolean}                      options.cache        lorem ipsum
 * @param  {boolean}                      options.zip          lorem ipsum
 * @return {Promise<undefined | Error>}                        lorem ipsum
 */
export const nwbuild = async (options) => {
  let nwDir = "";
  let nwPkg = {};
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
      log.debug(`nwbuild property is not defined in ${options.srcDir}/package.json`);
    } else {
      throw new Error(
        `nwbuild property in the ${
          options.srcDir
        }/package.json is of type ${typeof nwPkg.nwbuild}. Expected type object.`,
      );
    }

    // Parse options, set required values to undefined and flags with default values unless specified by user
    options = await parse(options);

    // Create cacheDir if it does not exist
    await mkdir(options.cacheDir, { recursive: false });

    // Validate options.version here
    // We need to do this to get the version specific release info
    releaseInfo = await getReleaseInfo(
      options.version,
      options.cacheDir,
      options.manifestUrl,
    );

    // TODO: validate options
    const e = await validate(options, releaseInfo);
    if (e === false) {
      throw new Error("Some option was invalid.");
    }

    // Get current platform and arch if mode is run
    if (options.mode === "run") {
      let tmpPlatform = await getPlatform(platform);
      let tmpArch = await getArch(arch);
      if (tmpPlatform === undefined) {
        throw new Error(`Platform ${platform} is not supported. Sorry!`);
      }
      if (tmpArch === undefined) {
        throw new Error(`Architecture ${arch} is not supported. Sorry!`);
      } else {
        options.platform = tmpPlatform;
        options.arch = tmpArch;
      }
    }

    // Variable to store nwDir file path
    nwDir = `${options.cacheDir}/nwjs${
      options.flavour === "sdk" ? "-sdk" : ""
    }-v${options.version}-${options.platform}-${options.arch}`;

    // Download relevant NW.js binaries
    let cached = await isCached(nwDir);
    if (options?.noCache === true || cached === false) {
      await rm(nwDir, { force: true, recursive: true });
      await download(
        options.version,
        options.flavour,
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
      );
    }
  } catch (error) {
    log.error(error);
    return error;
  }
};
