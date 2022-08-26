import fs from "node:fs";
// import updateNotifier from "update-notifier";
import { install } from "nw-install";
import { develop } from "nw-develop";
import { packager } from "nw-package";

import Options from "../constants/Options.js";
import getArchitecture from "../utilities/getArchitecture.js";
import getPlatform from "../utilities/getPlatform.js";
import parseOptions from "../utilities/parseOptions.js";

// import pkg from "../../package.json" assert { type: "json" };

const nwbuild = async (options) => {
  // updateNotifier({ pkg }).notify();

  options = parseOptions(options, Options);

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
      await develop(files, `${options.cacheDir}/nw`, platform);
      return 0;
    case "build":
      await packager(
        options.files,
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
