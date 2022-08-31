import fs from "node:fs";
// import updateNotifier from "update-notifier";
import { install } from "nw-install";
import { develop } from "nw-develop";
import { packager } from "nw-package";

import getArchitecture from "./getArchitecture.js";
import getPlatform from "./utilities/getPlatform.js";
import validate from "./validate.js";

// import pkg from "../../package.json" assert { type: "json" };

/**
 *
 * @param {object} options
 * @returns {Promise <0 | 1>}
 */
const nwbuild = async (options) => {
  // updateNotifier({ pkg }).notify();

  options = validate(options);

  let mode = options.mode ?? null;

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

  switch (mode) {
    case "run":
      await develop(options.appDir, `${options.cacheDir}/nw`, platform);
      return 0;
    case "build":
      await packager(
        options.appDir,
        `${options.cacheDir}/nw`,
        options.buildDir,
        platform,
      );
      return 0;
    default:
      console.log("Invalid mode. Please try again.");
      return 1;
  }
};

export default nwbuild;
