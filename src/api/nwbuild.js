import Options from "../constants/Options.js";
import detectCurrentPlatform from "../utilities/detectCurrentPlatform.js";

import run from "./run.js";

const nwbuild = (options) => {
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
  console.log(architecture);
  switch (mode) {
    case "run":
      run(
        options.files,
        options.version,
        options.flavour,
        platform,
        architecture,
        Options.mirror,
        Options.downloadUrl,
        options.outDir ?? Options.cacheDir,
        options.outFile,
      );
  }
};

export default nwbuild;
