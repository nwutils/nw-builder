import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import { log } from "../log.js";

/**
 * Remove NW.js binary
 *
 * @param  {string}        platform     - linux, macos, win32
 * @param  {string}        cacheDir     - Output directory
 * @param  {string}        downloadUrl  - Download URL
 * @return {Promise<void>}              - Promise
 */
const remove = async (platform, cacheDir, downloadUrl) => {
  try {
    if (downloadUrl === "https://dl.nwjs.io/") {
      if (platform === "linux") {
        await rm(resolve(cacheDir, "nw.tgz"));
      } else {
        await rm(resolve(cacheDir, "nw.zip"));
      }
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      await rm(resolve(cacheDir, "ffmpeg.zip"));
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { remove };
