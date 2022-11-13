import fs from "node:fs";

import { compress } from "./compress.js";
import { setLinuxConfig } from "./linuxCfg.js";
import { setOsxConfig } from "./osxCfg.js";
import { setWinConfig } from "./winCfg.js";

const packager = async (srcDir, nwDir, outDir, platform, zip) => {
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

  let buffer = fs.readFileSync(
    `${outDir}/${
      platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"
    }/package.json`,
  );
  let pkg = JSON.parse(buffer);

  switch (platform) {
    case "linux":
      setLinuxConfig(pkg, outDir);
      break;
    case "win":
      setWinConfig(pkg, outDir);
      break;
    case "osx":
      setOsxConfig(pkg, outDir);
    default:
      break;
  }

  if (zip === true) {
    await compress(outDir);
  } else if (zip === "zip" || zip === "tar") {
    await compress(outDir, zip);
  }

  return 0;
};

export { packager };
