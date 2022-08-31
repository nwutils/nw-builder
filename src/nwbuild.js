import fs from "node:fs";
import process from "node:process";
import { install } from "nw-install";
import { develop } from "nw-develop";
import { packager } from "nw-package";

import getArchitecture from "./getArchitecture.js";
import getPlatform from "./getPlatform.js";
import validate from "./validate.js";

/**
 * The options object passed into the nwbuild function
 * @typedef {object} OptionsSchema
 * @property {"run" | "build"} mode - Run or build your app
 * @property {string} appDir - Path to app directory
 */

/**
 * The main function which runs or builds the NW.js application
 * @param {OptionsSchema} options
 * @returns {Promise <0 | 1>}
 */
const nwbuild = async (options) => {

  options = validate(options);

  let platform = getPlatform(process);
  let architecture = getArchitecture(process);

  if (platform === null || architecture === null) {
    console.log("Unsupported platform/architecture.");
  }

  if (fs.existsSync(`${options.cacheDir}/nw`) === false) {
    await install(
      options.version,
      options.flavour,
      platform,
      architecture,
      "https://nwjs.io/",
      "https://dl.nwjs.io",
      options.cacheDir,
      "nw",
    );
  }

  if (options.mode === "run") {
    await develop(options.appDir, `${options.cacheDir}/nw`, platform);
    return 0;
  }
  // We can use  `else` here since we've already validated that mode is either `run` or `build`.
  else {
    await packager(
      options.appDir,
      `${options.cacheDir}/nw`,
      options.buildDir,
      platform,
    );
    return 0;
  }
};

export default nwbuild;
