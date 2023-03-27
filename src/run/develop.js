import { execute } from "./execute.js";
import { getPlatformSpecificName } from "./getPlatformSpecificName.js";

import { log } from "../log.js";

/**
 * Runs the NW app by spawning a child process
 *
 * @param  {string}                  srcDir    The directory to run from
 * @param  {string}                  nwDir     The directory to run nw.js from
 * @param  {"win" | "osx" | "linux"} platform  The platform to run for
 * @param  {string[]}                argv      The arguments to pass to the nw.js development server
 * @param  {boolean}                 glob      If true then glob then globbing is enabled
 * @return {Promise<undefined>}
 */
const develop = async (srcDir, nwDir, platform, argv, glob) => {
  try {
    if (getPlatformSpecificName(platform) === null) {
      throw new Error("Unsupported platform.");
    }
    if (glob === true) {
      throw new Error("Globbing is not supported by run mode.");
    }
    await execute(
      srcDir,
      `${nwDir}/${getPlatformSpecificName(platform)}`,
      argv,
    );
  } catch (error) {
    log.error(error);
  }
};

export { develop };
