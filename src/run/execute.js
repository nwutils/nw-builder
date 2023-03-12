import { spawn } from "node:child_process";

import { log } from "../log.js";

/**
 * Executes the NW.js process
 *
 * @param  {string}             srcDir  The source directory
 * @param  {string}             nwPath  The path to the NW.js executable
 * @param  {string}             argv    The arguments to pass to the NW.js process
 * @return {Promise<undefined>}         The exit code of the NW.js process
 * @throws {Error} - If the NW.js process fails to start
 */
const execute = (srcDir, nwPath, argv) => {
  return new Promise((resolve, reject) => {
    // It is assumed that the first glob pattern p contains the package.json at p/package.json
    srcDir = srcDir.split(" ")[0];
    srcDir = srcDir.replace(/\*[/*]*/, "");
    const nwProcess = spawn(nwPath, [srcDir.concat(argv)], {
      detached: true,
      windowsHide: true,
    });

    nwProcess.on("close", () => {
      resolve();
    });

    nwProcess.on("error", (error) => {
      log.error(error);
      reject(error);
    });
  });
};

export { execute };
