import { resolve } from "node:path";

import Decompress from "decompress";

import { log } from "../log.js";

/**
 * Decompress NW.js binary
 *
 * @param  {string}        platform  Platform
 * @param  {string}        outDir    Output directory
 * @return {Promise<void>}
 */
const decompress = async (platform, outDir) => {
  try {
    if (platform === "linux") {
      await Decompress(resolve(outDir, "nw.tar.gz"), outDir);
    } else {
      await Decompress(resolve(outDir, "nw.zip"), outDir);
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
