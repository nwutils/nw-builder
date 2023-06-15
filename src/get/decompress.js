import { resolve } from "node:path";

import compressing from "compressing";

import { log } from "../log.js";

/**
 * Decompress NW.js binary
 *
 * @param  {string}        platform     Platform
 * @param  {string}        cacheDir     Output directory
 * @param  {string}        downloadUrl  Download url
 * @return {Promise<void>}
 */
const decompress = async (platform, cacheDir, downloadUrl) => {
  try {
    if (
      downloadUrl === "https://dl.nwjs.io" ||
      downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
      downloadUrl === "https://npmmirror.com/mirrors/nwjs" ||
      downloadUrl ===
        "https://github.com/corwin-of-amber/nw.js/releases/download"
    ) {
      if (platform === "linux") {
        await compressing.tar.uncompress(
          resolve(cacheDir, "nw.tar.gz"),
          cacheDir
        );
      } else {
        compressing.zip.uncompress(resolve(cacheDir, "nw.zip"), cacheDir);
      }
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      await compressing.zip.uncompress(
        resolve(cacheDir, "ffmpeg.zip"),
        cacheDir
      );
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
