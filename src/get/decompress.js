import { resolve } from "node:path";

import Decompress from "decompress";

import { log } from "../log.js";

/**
 * Decompress NW.js binary
 *
 * @param  {string}        platform     Platform
 * @param  {string}        outDir       Output directory
 * @param  {string}        downloadUrl  Download url
 * @return {Promise<void>}
 */
const decompress = async (platform, outDir, downloadUrl) => {
  try {
    if (downloadUrl === "https://dl.nwjs.io") {
      if (platform === "linux") {
        await Decompress(resolve(outDir, "nw.tar.gz"), outDir);
      } else {
        await Decompress(resolve(outDir, "nw.zip"), outDir);
      }
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      console.log("hereeseeee");
      await Decompress(resolve(outDir, "ffmpeg.zip"), outDir);
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
