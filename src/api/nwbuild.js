import updateNotifier from 'update-notifier';

import Options from "../constants/Options.js";
import detectCurrentPlatform from "../utilities/detectCurrentPlatform.js";
import parseOptions from "../utilities/parseOptions.js";

import run from "./run.js";
// import build from "./build.js";
import pkg from "../../package.json" assert {type: "json"};

const nwbuild = async (options) => {

  updateNotifier({ pkg }).notify();

  options = parseOptions(options, Options);

  let mode = options.mode ?? null;

  let currentPlatform = detectCurrentPlatform(process);
  if (currentPlatform === undefined) {
    console.log("Unsupported platform");
    process.exit(1);
  }
  let platform = currentPlatform.substring(0, currentPlatform.length - 2);
  let architecture = currentPlatform.substring(
    currentPlatform.length - 2,
    currentPlatform.length,
  );
  if (architecture === "64") {
    architecture = "x64";
  } else {
    architecture = "ia32";
  }
  switch (mode) {
    case "run":
      run(
        options.files,
        options.version,
        options.flavour,
        platform,
        architecture,
        "https://nwjs.io/",
        "https://dl.nwjs.io",
        `v${options.version}/${options.flavour}/${platform}/${architecture}`,
        "nw",
      );
      return 0;
    case "build":
      build();
      return 0;
    default:
      console.log("Invalid mode. Please try again.");
      return 1;
  }
};

export default nwbuild;
