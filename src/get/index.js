import fs from "node:fs";
import path from "node:path";

import decompress from "./decompress.js";
import ffmpeg from "./ffmpeg.js";
import node from "./node.js";
import nw from "./nw.js";

import util from "../util.js";

/**
 * @typedef {object} GetOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]                  Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]                   Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]                            Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                                Target arch
 * @property {string}                               [downloadUrl = "https://dl.nwjs.io"]  Download server
 * @property {string}                               [cacheDir = "./cache"]                Cache directory
 * @property {boolean}                              [cache = true]                        If false, remove cache and redownload.
 * @property {boolean}                              [ffmpeg = false]                      If true, ffmpeg is not downloaded.
 * @property {false | "gyp"}                        [nativeAddon = false]                 Rebuild native modules
 */

/**
 * Get binaries.
 *
 * @async
 * @function
 * @param  {GetOptions}    options  Get mode options
 * @return {Promise<void>}
 */
async function get(options) {

  /**
   * If `options.cacheDir` exists, then `true`. Otherwise, it is `false`. 
   * 
   * @type {boolean}
   */
  const cacheDirExists = await util.fileExists(options.cacheDir);
  if (cacheDirExists === false) {
    await fs.promises.mkdir(options.cacheDir, { recursive: true });
  }

  /**
   * File path to compressed binary.
   * 
   * @type {string}
   */
  let nwFilePath = path.resolve(
    options.cacheDir,
    `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}.${options.platform === "linux" ? "tar.gz" : "zip"
    }`,
  );

  /**
   * File path to directory which contain NW.js and related binaries.
   * 
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

  /**
   * If the compressed binary exists, then `true`. Otherwise, it is `false`. 
   * 
   * @type {boolean}
   */
  const nwFilePathExists = await util.fileExists(nwFilePath);
  if (nwFilePathExists === false) {
    nwFilePath = await nw(options.downloadUrl, options.version, options.flavor, options.platform, options.arch, options.cacheDir);
  }

  await decompress(nwFilePath, options.cacheDir);

  // TODO: remove once linked issue is resolved.
  // https://github.com/overlookmotel/yauzl-promise/issues/39
  if (options.platform === "osx") {
    await createSymlinks(options);
  }

  if (options.ffmpeg === true) {

  /**
   * File path to compressed binary which contains community FFmpeg binary.
   * 
   * @type {string}
   */
    let ffmpegFilePath = path.resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}.zip`,
    );

    // If `options.cache` is false, then remove the compressed binary.
    if (options.cache === false) {
      await fs.promises.rm(ffmpegFilePath, {
        recursive: true,
        force: true,
      });
    }

    const ffmpegFilePathExists = await util.fileExists(ffmpegFilePath);
    if (ffmpegFilePathExists === false) {
      ffmpegFilePath = await ffmpeg(options.downloadUrl, options.version, options.platform, options.arch, options.cacheDir);
    }

    await decompress(ffmpegFilePath, options.cacheDir);

    /**
     * Platform dependant file name of FFmpeg binary.
     * 
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
     * 
     * @type {string}
     */
    let ffmpegBinaryPath = path.resolve(nwDirPath, ffmpegFileName);
    
    /**
     * File path of where FFmpeg will be copied to.
     * 
     * @type {string}
     */
    let ffmpegBinaryDest = "";

    if (options.platform === "linux") {
      ffmpegBinaryDest = path.resolve(nwDirPath, "lib", ffmpegFileName);
    } else if (options.platform === "win") {
      // Extracted file is already in the correct path
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

  if (options.nativeAddon === "gyp") {

    /**
     * File path to NW'js Node headers tarball.
     * 
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

    /**
     * If the compressed binary exists, then `true`. Otherwise, it is `false`. 
     * 
     * @type {boolean}
     */
    const nodeFilePathExists = await util.fileExists(nodeFilePath);
    if (nodeFilePathExists === false) {
      nodeFilePath = await node(options.downloadUrl, options.version, options.cacheDir);
    }

    await decompress(nodeFilePath, options.cacheDir);

  }
}

/**
 * Workaround for manually creating symbolic links for MacOS builds.
 * Tracking in linked issue.
 * @link https://github.com/overlookmotel/yauzl-promise/issues/39
 * @param {*} options 
 */
const createSymlinks = async (options) => {
  let frameworksPath = path.resolve(process.cwd(), options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework")
  // Allow resolve cacheDir from another directory for prevent crash
  if (!fs.lstatSync(frameworksPath).isDirectory()) {
    frameworksPath = path.resolve(options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework")
  }
  const symlinks = [
    path.join(frameworksPath, "Helpers"),
    path.join(frameworksPath, "Libraries"),
    path.join(frameworksPath, "nwjs Framework"),
    path.join(frameworksPath, "Resources"),
    path.join(frameworksPath, "Versions", "Current"),
  ];
  for await (const symlink of symlinks) {
    const buffer = await fs.promises.readFile(symlink);
    const link = buffer.toString();
    await fs.promises.rm(symlink);
    await fs.promises.symlink(link, symlink);
  }
};

export default get;
