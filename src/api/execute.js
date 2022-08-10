import path from "node:path";
import { spawn } from "node:child_process";

import Platform from "../constants/platform";

const execute = (cacheDir, srcDir, platform) => {
  return new Promise((resolve) => {
    let nw = null;
    let exePath = null;
    let files = null;
    let nwProcess = null;

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

    nwProcess = spawn(exePath, [files]);

    nwProcess.on("close", () => {
      resolve();
    });
  });
};

export default execute;
