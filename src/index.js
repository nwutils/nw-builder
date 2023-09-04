import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { arch, platform, version } from "node:process";

import { build } from "./bld/build.js";
import { run } from "./run.js";
import { isCached } from "./util/cache.js";
import { getFiles } from "./util/files.js";
import { getVersionManifest } from "./util/versionManifest.js";
import { parse } from "./util/parse.js";
import { validate } from "./util/validate.js";

import { get_nwjs } from "./get_nwjs.js";
import { get_ffmpeg } from "./get_ffmpeg.js";
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
 * Automates building an NW.js application.
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
      log.debug(`Platform: ${platform}`);
      log.debug(`Archicture: ${arch}`);
      log.debug(`Node Version: ${version}`);
      log.debug(`NW.js Version: ${options.version}\n`);
    }

    nwDir = resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${
        options.platform
      }-${options.arch}`,
    );

    // Download NW.js binaries
    await get_nwjs({
      version: options.version,
      flavor: options.flavor,
      platform: options.platform,
      arch: options.arch,
      downloadUrl: options.downloadUrl,
      cacheDir: options.cacheDir,
      cache: options.cache,
    });

    // Download ffmpeg binaries and replace chromium ffmpeg
    if (options.ffmpeg === true) {
      await get_ffmpeg({
        version: options.version,
        flavor: options.flavor,
        platform: options.platform,
        arch: options.arch,
        cacheDir: options.cacheDir,
        cache: options.cache,
      });
    }

    if (options.mode === "get") {
      // Do nothing since we have already downloaded the binaries
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
        options.platform,
        options.zip,
        options.app,
        manifest,
      );
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export default nwbuild;
