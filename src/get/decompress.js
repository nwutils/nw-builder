import { resolve } from "node:path";

import Decompress from "decompress";

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
    if (downloadUrl === "https://dl.nwjs.io") {
      if (platform === "linux") {
        await Decompress(resolve(cacheDir, "nw.tar.gz"), cacheDir);
      } else {
        await Decompress(resolve(cacheDir, "nw.zip"), cacheDir);
      }
    } else if (downloadUrl === "https://github.com/corwin-of-amber/nw.js/releases/download") {
      await Decompress(resolve(cacheDir, "nw.zip"), cacheDir);
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      await Decompress(resolve(cacheDir, "ffmpeg.zip"), cacheDir);
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
