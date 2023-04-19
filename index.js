import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

import { decompress } from "./src/get/decompress.js";
import { download } from "./src/get/download.js";
import { getReleaseInfo } from "./src/get/getReleaseInfo.js";
import { remove } from "./src/get/remove.js";
import { build } from "./src/bld/build.js";
import { develop } from "./src/run/develop.js";
import { isCached } from "./src/util/cache.js";
import { replaceFfmpeg } from "./src/util/ffmpeg.js";
import { getFiles } from "./src/util/files.js";
import { getVersionManifest } from "./src/util/versionManifest.js";
import { parse } from "./src/util/parse.js";
import { validate } from "./src/util/validate.js";
import { xattr } from "./src/util/xattr.js";

import { log } from "./src/log.js";

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
 * @property {object}                              app                                       Multi platform configuration options
 * @property {boolean}                             [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean}                             [zip=false]                               If true the outDir directory is zipped
 * @property {boolean}                             [cli=false]                               If true the CLI is used to glob srcDir and parse other options
 * @property {boolean}                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
 * @property {boolean}                             [glob=true]                               If true globbing is enabled
 */

/**
 * Automates building an NW.js application.
 *
 * @param  {Options}            options  Options
 * @return {Promise<undefined>}
 */
const nwbuild = async (options) => {
  let nwDir = "";
  let ffmpegFile = "";
  let cached;
  let nwCached;
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

    // Create cacheDir if it does not exist
    cached = await isCached(options.cacheDir);
    if (cached === false) {
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

    // Remove leading "v" from version string
    options.version = releaseInfo.version.slice(1);

    // Variable to store nwDir file path
    nwDir = resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform
      }-${options.arch}`,
    );

    nwCached = await isCached(nwDir);
    // Remove cached NW binary
    if (options.cache === false && nwCached === true) {
      log.debug("Remove cached NW binary");
      await rm(nwDir, { force: true, recursive: true });
    }
    // Download relevant NW.js binaries
    if (nwCached === false) {
      log.debug("Download relevant NW.js binaries");
      await download(
        options.version,
        options.flavor,
        options.platform,
        options.arch,
        options.downloadUrl,
        options.cacheDir,
      );
      await decompress(options.platform, options.cacheDir, options.downloadUrl);
      await remove(options.platform, options.cacheDir, options.downloadUrl);
    } else {
      log.debug("Using cached NW.js binaries");
    }

    if (options.ffmpeg === true) {
      log.warn(
        "Using MP3 and H.264 codecs requires you to pay attention to the patent royalties and the license of the source code. Consult a lawyer if you do not understand the licensing constraints and using patented media formats in your app. See https://chromium.googlesource.com/chromium/third_party/ffmpeg.git/+/master/CREDITS.chromium for more information.",
      );
      if (options.platform === "win") {
        ffmpegFile = "libffmpeg.dll";
      } else if (options.platform === "osx") {
        ffmpegFile = "libffmpeg.dylib";
      } else if (options.platform === "linux") {
        ffmpegFile = "libffmpeg.so";
      }
      ffmpegFile = resolve(options.cacheDir, ffmpegFile);
      const ffmpegCached = await isCached(ffmpegFile);
      // Remove cached ffmpeg binary
      if (options.cache === false && ffmpegCached === true) {
        log.debug("Remove cached ffmpeg binary");
        await rm(ffmpegFile, { force: true, recursive: true });
      }

      // Download relevant ffmpeg binaries
      if (ffmpegCached === false) {
        log.debug("Download relevant ffmpeg binaries");
        await download(
          options.version,
          options.flavor,
          options.platform,
          options.arch,
          "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
          options.cacheDir,
        );
        await decompress(
          options.platform,
          options.cacheDir,
          "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
        );
        await remove(
          options.platform,
          options.cacheDir,
          "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
        );

        await replaceFfmpeg(options.platform, nwDir, ffmpegFile);
      }
    }

    await xattr(options.platform, options.arch, nwDir);

    // Downloading binaries is required for run and build modes
    // If mode is get, exit function since we have gotten the binaries
    if (options.mode === "get") {
      return undefined;
    }

    if (options.mode === "run") {
      await develop(
        options.srcDir,
        nwDir,
        options.platform,
        options.argv,
        options.glob,
      );
    }
    if (options.mode === "build") {
      await build(
        options.glob === true ? files : options.srcDir,
        nwDir,
        options.outDir,
        options.platform,
        options.zip,
        releaseInfo,
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
