import path from "node:path";

import extract from "extract-zip";
import tar from "tar";

import { log } from "../log.js";

/**
 * Decompresses a zip or tar.gz file into a directory
 *
 * @param  {string}             platform  The platform to decompress for
 * @param  {string}             outDir    The directory to decompress into
 * @return {Promise<undefined>}           The exit code
 */
const decompress = (platform, outDir) => {
  return new Promise((resolve, reject) => {
    if (platform === "linux") {
      tar
        .x({
          file: `${outDir}/nw.tar.gz`,
          C: `${outDir}`,
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          log.error(error);
          reject(error);
        });
    } else {
      extract(path.resolve(`${outDir}/nw.zip`), {
        dir: path.resolve(`${outDir}`),
      })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          log.error(error);
          reject(error);
        });
    }
  });
};

export { decompress };
