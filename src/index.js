import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { arch, platform, version } from "node:process";

import { isCached } from "./util/cache.js";
import { getFiles } from "./util/files.js";
import { getVersionManifest } from "./util/versionManifest.js";
import { parse } from "./util/parse.js";
import { validate } from "./util/validate.js";

import { build } from "./build.js";
import { get } from "./get.js";
import { run } from "./run.js";
import { log, setLogLevel } from "./log.js";
import { getReleaseInfo } from "./util.js";

/**
 * @typedef {object} Options Configuration options
 * @property {"./" | string}                       [srcDir="./"]                             String of space separated glob patterns which correspond to NW app code
 * @property {"get" | "run" | "build"}             [mode="build"]                            Run or build application
 * @property {"latest" | "stable" | string}        [version="latest"]                        NW runtime version
 * @property {"normal" | "sdk"}                    [flavor="normal"]                         NW runtime build flavor
 * @property {"linux" | "osx" | "win"}             platform                                  NW supported platforms
 * @property {"ia32" | "x64" | "arm64"}            arch                                      NW supported architectures
 * @property {"./out" | string}                    [outDir="./out"]                          Directory to store build artifacts
 * @property {"./cache" | string}                  [cacheDir="./cache"]                      Directory to store NW binaries
 * @property {"https://dl.nwjs.io" | string}       [downloadUrl="https://dl.nwjs.io"]        URI to download NW binaries from
 * @property {"https://nwjs.io/versions" | string} [manifestUrl="https://nwjs.io/versions"]  URI to download manifest from
 * @property {object}                              app                                       Refer to Linux/Windows Specific Options under Getting Started in the docs
 * @property {boolean}                             [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean | "zip" | "tar" | "tgz"}     [zip=false]                               If true, "zip", "tar" or "tgz" the outDir directory is compressed.
 * @property {boolean}                             [cli=false]                               If true the CLI is used to glob srcDir and parse other options
 * @property {boolean}                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
 * @property {boolean}                             [glob=true]                               If true globbing is enabled
 * @property {"error" | "warn" | "info" | "debug"} [logLevel="info"]                         Specified log level.
 */

/**
 * Installation Guide
 *
 * Every NW.js release includes a modified Node.js binary at a specific version. It is recommended to [install](https://nodejs.org/en/download/package-manager) exactly that version on the host system. Not doing so may download ABI incompatible Node modules. Consult the NW.js [versions manifest](https://nwjs.io/versions) for what Node.js version to install. It is recommended to use a Node version manager (such as [volta](https://volta.sh), n, nvm, or nvm-windows) to be able to easily install and switch between Node versions.
 *
 * Please refer to the examples below for basic usage.
 *
 * @example
 * // ESM usage:
 *
 * import nwbuild from "nw-builder";
 *
 * @example
 * // CJS usage
 *
 * let nwbuild = undefined;
 *
 * (() => {
 * try {
 * nwbuild = await import("nw-builder");
 * } catch(error) {
 * console.error(error);
 * }
 * })();
 *
 * @example
 * // Module usage
 *
 * nwbuild();
 *
 * @example
 * // CLI usage
 *
 * npx nwbuild
 *
 * @example
 * // Node manifest usage
 *
 * "nwbuild": {}
 *
 * @param  {Options}            options  Options
 * @return {Promise<undefined>}
 */
const nwbuild = async (options) => {
  let nwDir = "";
  let built;
  let releaseInfo = {};
  let files = [];
  let manifest = {};

  try {
    // Parse options
    options = await parse(options, manifest);

    if (options.mode !== "get") {
      files = options.glob ? await getFiles(options.srcDir) : options.srcDir;
      manifest = await getVersionManifest(files, options.glob);
      if (typeof manifest?.nwbuild === "object") {
        options = manifest.nwbuild;
      }
    }

    options = await parse(options, manifest);

    built = await isCached(options.cacheDir);
    if (built === false) {
      await mkdir(options.cacheDir, { recursive: true });
    }

    if (options.mode !== "get" && options.mode !== "run") {
      // Create outDir if it does not exist
      built = await isCached(options.outDir);
      if (built === false) {
        await mkdir(options.outDir, { recursive: true });
      }
    }

    // Validate options.version to get the version specific release info
    releaseInfo = await getReleaseInfo(
      options.version,
      options.platform,
      options.arch,
      options.cacheDir,
      options.manifestUrl,
    );

    await validate(options, releaseInfo);

    setLogLevel(options.logLevel);

    // Remove leading "v" from version string
    options.version = releaseInfo.version.slice(1);

    if (options.logLevel === "debug") {
      log.debug(`System Platform: ${platform}`);
      log.debug(`System Architecture: ${arch}`);
      log.debug(`Node Version: ${version}`);
      log.debug(`Build NW.js Version: ${options.version}`);
      log.debug(`Build Flavor: ${options.flavor}`);
      log.debug(`Build Platform: ${options.platform}`);
      log.debug(`Build Architecture: ${options.arch}`);
    }

    nwDir = resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${
        options.platform
      }-${options.arch}`,
    );

    // Download binaries
    await get({
      version: options.version,
      flavor: options.flavor,
      platform: options.platform,
      arch: options.arch,
      downloadUrl: options.downloadUrl,
      cacheDir: options.cacheDir,
      cache: options.cache,
      ffmpeg: options.ffmpeg,
      nativeAddon: options.nativeAddon,
    });

    if (options.mode === "get") {
      // Do nothing else since we have already downloaded the binaries.
      return;
    }

    if (options.mode === "run") {
      await run({
        version: options.version,
        flavor: options.flavor,
        platform: options.platform,
        arch: options.arch,
        srcDir: options.srcDir,
        cacheDir: options.cacheDir,
        glob: options.glob,
        argv: options.argv,
      });
    } else if (options.mode === "build") {
      await build(
        options.glob === true ? files : options.srcDir,
        nwDir,
        options.outDir,
        options.cacheDir,
        options.version,
        options.platform,
        options.arch,
        options.zip,
        options.managedManifest,
        manifest,
        options.nativeAddon,
        releaseInfo.components.node,
        options.app,
      );
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export default nwbuild;
