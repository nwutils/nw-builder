import path from "node:path";
import { spawn } from "node:child_process";

import Platform from "../constants/platform";

const execute = async (cacheDir, srcDir, platform) => {
  let nw = null;
  let exePath = null;
  let files = null;

  console.log(platform);

  switch (platform) {
    case `${Platform.NIX}`:
      nw = "nw";
      break;
    case `${Platform.OSX}`:
      nw = "nwjs.app/Contents/MacOS/nwjs";
      break;
    case `${Platform.WIN}`:
      nw = "nw.exe";
      break;
    default:
      console.log(
        "[ ERROR ] The current platform does not support the NW.js binary.",
      );
      process.exit(1);
  }

  exePath = path.resolve(cacheDir, nw);

  if (Array.isArray(srcDir)) {
    files = srcDir[0];
  } else {
    files = srcDir;
  }

  let nwProcess = spawn(exePath, [files]);

  nwProcess.on("close", () => {});
};

export default execute;
