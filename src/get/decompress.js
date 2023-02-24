import fs from "node:fs";
import { resolve } from "node:path";

import Decompress from "decompress";
import { open } from "yauzl";

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
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      await Decompress(resolve(cacheDir, "ffmpeg.zip"), cacheDir);
      // open(resolve(cacheDir, "ffmpeg.zip"), { lazyEntries: true }, (error, zipfile) => {
      //   if (error) {
      //     throw error;
      //   }
      //   zipfile.readEntry();
      //   zipfile.on("entry", (entry) => {
      //     if (/\/$/.test(entry.fileName)) {
      //       zipfile.readEntry();
      //     } else {
      //       zipfile.openReadStream(entry, (err, readStream) => {
      //         if (err) {
      //           throw err;
      //         } else {
      //           readStream.on("end", () => {
      //             zipfile.readEntry();
      //           });
      //           readStream.pipe(fs.createWriteStream(resolve(cacheDir, entry.fileName)));
      //         }
      //       });
      //     }
      //   });
      // });
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
