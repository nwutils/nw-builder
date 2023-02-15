import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import { log } from "../log.js";

/**
 * Remove NW.js binary
 *
 * @param  {string}        platform  - linux, macos, win32
 * @param  {string}        outDir    - Output directory
 * @return {Promise<void>}           - Promise
 */
const remove = async (platform, outDir) => {
  try {
    await rm(resolve(outDir, `nw.${platform === "linux" ? "tar.gz" : "zip"}`));
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export { remove };
