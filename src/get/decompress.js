import { resolve } from "node:path";

import extract from "extract-zip";
import tar from "tar";

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
      await tar.x({
        file: resolve(outDir, "nw.tar.gz"),
        C: outDir,
      });
    } else {
      await extract(resolve(outDir, "nw.zip"), {
        dir: outDir,
      });
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { decompress };
