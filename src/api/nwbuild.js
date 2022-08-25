import updateNotifier from "update-notifier";

import Options from "../constants/Options.js";
import getArchitecture from "../utilities/getArchitecture.js";
import getPlatform from "../utilities/getPlatform.js";
import parseOptions from "../utilities/parseOptions.js";

import run from "./run.js";
// import build from "./build.js";
import pkg from "../../package.json" assert { type: "json" };

const nwbuild = async (options) => {
  updateNotifier({ pkg }).notify();

  options = parseOptions(options, Options);

  let mode = options.mode ?? null;

  let platform = getPlatform(process);
  let architecture = getArchitecture(process);

  if (platform === null || architecture === null) {
    console.log("Unsupported platform/architecture.");
  }

  switch (mode) {
    case "run":
      await run(
        options.files,
        options.version,
        options.flavour,
        platform,
        architecture,
        "https://nwjs.io/",
        "https://dl.nwjs.io",
        options.outDir ??
          `v${options.version}/${options.flavour}/${platform}/${architecture}`,
        "nw",
      );
      return 0;
    case "build":
      // build();
      return 0;
    default:
      console.log("Invalid mode. Please try again.");
      return 1;
  }
};

export default nwbuild;
