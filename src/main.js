import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import semver from "semver";

import decompress from "./decompress.js";
import ffmpeg from "./ffmpeg.js";
import node from "./node.js";
import nw from "./nw.js";
import request from "./request.js";
import verify from "./verify.js";

/**
 * @typedef {object} Options
 * @property {string | "latest" | "stable" | "lts"} version                    Runtime version
 * @property {"normal" | "sdk"}                     flavor                     Build flavor
 * @property {"linux" | "osx" | "win"}              platform                   Target platform
 * @property {"ia32" | "x64" | "arm64"}             arch                       Target architecture
 * @property {"https://dl.nwjs.io"}                 downloadUrl                Download server, accepts http and https
 * @property {"https://nwjs.io/versions.json"}      manifestUrl                Manifest URI, accepts file, http and https
 * @property {string}                               cacheDir                   Cache directory
 * @property {boolean}                              cache                      If false, remove cache and redownload.
 * @property {boolean}                              ffmpeg                     If true, ffmpeg is not downloaded.
 * @property {boolean}                              nativeAddon                If true, download node headers.
 * @property {boolean}                              shaSum                     If true shasum is enabled, otherwise disabled.
 */

/**
 * Get NW.js and related binaries for Linux, MacOS and Windows.
 * @async
 * @function
 * @param  {Options}    options  Get mode options
 * @returns {Promise<void>}
 */
async function get(options) {
  /* If `options.cacheDir` exists, then `true`. Otherwise, it is `false`. */
  if (fs.existsSync(options.cacheDir) === false) {
    await fs.promises.mkdir(options.cacheDir, { recursive: true });
  }

  const manifestFilePath = path.resolve(options.cacheDir, "manifest.json");
  if (options.manifestUrl.startsWith("file://")) {
    const filePath = url.fileURLToPath(options.manifestUrl);
    fs.writeFileSync(manifestFilePath, fs.readFileSync(filePath, "utf-8"));
  } else {
    await request(options.manifestUrl, manifestFilePath);
  }
  const manifestData = JSON.parse(
    await fs.promises.readFile(manifestFilePath, "utf-8"),
  );

  if (
    options.version === "latest" ||
    options.version === "stable" ||
    options.version === "lts"
  ) {
    options.version = manifestData[options.version].slice(1);
  } else {
    const coerced = semver.coerce(options.version);
    if (coerced && semver.valid(coerced)) {
      options.version = coerced.version;
    } else {
      throw new Error(
        'Expected "options.version" to be "latest", "stable", "lts" or a valid semver version. Received: ' +
          options.version,
      );
    }
  }

  if (options.flavor !== "normal" && options.flavor !== "sdk") {
    throw new Error(
      'Expected "options.flavor" to be "normal" or "sdk". Received: ' +
        options.flavor,
    );
  }

  if (
    options.platform !== "linux" &&
    options.platform !== "osx" &&
    options.platform !== "win"
  ) {
    throw new Error(
      'Expected "options.platform" to be "linux", "osx" or "win". Received: ' +
        options.platform,
    );
  }

  if (
    options.arch !== "ia32" &&
    options.arch !== "x64" &&
    options.arch !== "arm64"
  ) {
    throw new Error(
      'Expected "options.arch" to be "ia32", "x64" or "arm64". Received: ' +
        options.arch,
    );
  }

  if (typeof options.downloadUrl !== "string") {
    throw new Error(
      'Expected "options.downloadUrl" to be a string. Received: ' +
        options.downloadUrl,
    );
  }

  if (typeof options.manifestUrl !== "string") {
    throw new Error(
      'Expected "options.manifestUrl" to be a string. Received: ' +
        options.manifestUrl,
    );
  }

  if (
    typeof options.manifestUrl == "string" &&
    options.manifestUrl.startsWith("file://") === false &&
    options.manifestUrl.startsWith("http://") === false &&
    options.manifestUrl.startsWith("https://") === false
  ) {
    throw new Error(
      'Expected "options.manifestUrl" to be a string starting with "file://", "http://", or "https://". Received: ' +
        options.manifestUrl,
    );
  }

  if (typeof options.cacheDir !== "string") {
    throw new Error(
      'Expected "options.cacheDir" to be a string. Received: ' +
        options.cacheDir,
    );
  }

  if (typeof options.cache !== "boolean") {
    throw new Error(
      'Expected "options.cache" to be a boolean. Received: ' + options.cache,
    );
  }

  if (typeof options.ffmpeg !== "boolean") {
    throw new Error(
      'Expected "options.ffmpeg" to be a boolean. Received: ' + options.ffmpeg,
    );
  }

  if (typeof options.nativeAddon !== "boolean") {
    throw new Error(
      'Expected "options.nativeAddon" to be a boolean. Received: ' +
        options.nativeAddon,
    );
  }

  if (typeof options.shaSum !== "boolean") {
    throw new Error(
      'Expected "options.shaSum" to be a boolean. Received: ' + options.shaSum,
    );
  }

  const uri = new url.URL(options.downloadUrl);

  /* Download server is the cached directory. */
  if (uri.protocol === "file:") {
    options.cacheDir = path.resolve(
      decodeURIComponent(options.downloadUrl.slice("file://".length)),
    );
  }

  /**
   * File path to compressed binary.
   * @type {string}
   */
  let nwFilePath = path.resolve(
    options.cacheDir,
    `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}.${
      options.platform === "linux" ? "tar.gz" : "zip"
    }`,
  );

  /**
   * File path to directory which contains NW.js and related binaries.
   * @type {string}
   */
  let nwDirPath = path.resolve(
    options.cacheDir,
    `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`,
  );

  // If `options.cache` is false, then remove the compressed binary.
  if (options.cache === false) {
    await fs.promises.rm(nwFilePath, {
      recursive: true,
      force: true,
    });
  }

  // We remove the nwDir to prevent the edge case where you download with ffmpeg flag enabled
  // but want a subsequent build with ffmpeg flag disabled. By removing the directory and
  // decompressing it again, we prevent the community ffmpeg files from being left over.
  // This is important since the community ffmpeg builds have specific licensing constraints.
  await fs.promises.rm(nwDirPath, { recursive: true, force: true });

  /* If the compressed binary exists, then `true`. Otherwise, it is `false`. */
  if (fs.existsSync(nwFilePath) === false) {
    nwFilePath = await nw(
      options.downloadUrl,
      options.version,
      options.flavor,
      options.platform,
      options.arch,
      options.cacheDir,
    );
  }

  await decompress(nwFilePath, options.cacheDir);

  await verify(
    `${options.downloadUrl}/v${options.version}/SHASUMS256.txt`,
    `${options.cacheDir}/shasum/${options.version}.txt`,
    options.cacheDir,
    options.ffmpeg,
    options.shaSum,
  );

  if (options.ffmpeg === true) {
    /**
     * File path to compressed binary which contains community FFmpeg binary.
     * @type {string}
     */
    let ffmpegFilePath = path.resolve(
      options.cacheDir,
      `ffmpeg-${options.version}-${options.platform}-${options.arch}.zip`,
    );

    // If `options.cache` is false, then remove the compressed binary.
    if (options.cache === false) {
      await fs.promises.rm(ffmpegFilePath, {
        recursive: true,
        force: true,
      });
    }

    /* If the compressed binary exists, then `true`. Otherwise, it is `false`. */
    if (fs.existsSync(ffmpegFilePath) === false) {
      // Do not update the options.downloadUrl with the ffmpeg URL here. Doing so would lead to error when options.ffmpeg and options.nativeAddon are both enabled.
      const downloadUrl =
        "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download";
      ffmpegFilePath = await ffmpeg(
        downloadUrl,
        options.version,
        options.platform,
        options.arch,
        options.cacheDir,
      );
    }

    await decompress(ffmpegFilePath, options.cacheDir);

    /**
     * Platform dependant file name of FFmpeg binary.
     * @type {string}
     */
    let ffmpegFileName = "";

    if (options.platform === "linux") {
      ffmpegFileName = "libffmpeg.so";
    } else if (options.platform === "win") {
      ffmpegFileName = "ffmpeg.dll";
    } else if (options.platform === "osx") {
      ffmpegFileName = "libffmpeg.dylib";
    }

    /**
     * File path to platform specific FFmpeg file.
     * @type {string}
     */
    let ffmpegBinaryPath = path.resolve(options.cacheDir, ffmpegFileName);

    /**
     * File path of where FFmpeg will be copied to.
     * @type {string}
     */
    let ffmpegBinaryDest = "";

    if (options.platform === "linux") {
      ffmpegBinaryDest = path.resolve(nwDirPath, "lib", ffmpegFileName);
    } else if (options.platform === "win") {
      ffmpegBinaryDest = path.resolve(nwDirPath, ffmpegFileName);
    } else if (options.platform === "osx") {
      ffmpegBinaryDest = path.resolve(
        nwDirPath,
        "nwjs.app",
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
        ffmpegFileName,
      );
    }

    await fs.promises.copyFile(ffmpegBinaryPath, ffmpegBinaryDest);
  }

  if (options.nativeAddon === true) {
    /**
     * File path to NW.js Node headers tarball.
     * @type {string}
     */
    let nodeFilePath = path.resolve(
      options.cacheDir,
      `headers-v${options.version}.tar.gz`,
    );

    // If `options.cache` is false, then remove the compressed binary.
    if (options.cache === false) {
      await fs.promises.rm(nodeFilePath, {
        recursive: true,
        force: true,
      });
    }

    /* If the compressed binary exists, then `true`. Otherwise, it is `false`. */
    if (fs.existsSync(nodeFilePath) === false) {
      nodeFilePath = await node(
        options.downloadUrl,
        options.version,
        options.cacheDir,
      );
    }

    await decompress(nodeFilePath, options.cacheDir);
  }
}

export default get;
