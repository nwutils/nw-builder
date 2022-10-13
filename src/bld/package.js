import fs from "node:fs";

import { setLinuxConfig } from "./linuxCfg.js";
import { setWinConfig } from "./winCfg.js";

const packager = async (srcDir, nwDir, outDir, platform) => {
  fs.rmSync(outDir, { force: true, recursive: true });
  fs.cpSync(nwDir, outDir, { recursive: true });
  fs.cpSync(
    srcDir,
    `${outDir}/${
      platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"
    }`,
    {
      recursive: true,
    },
  );

  let buffer = fs.readFileSync(`${outDir}/${platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"}/package.json`);
  let pkg = JSON.parse(buffer);

  switch (platform) {
    case "linux":
      setLinuxConfig(pkg, outDir);
      break;
    case "win":
      setWinConfig(pkg, outDir);
      break;
    default:
      break;
  }
  return 1;
};

export { packager };
