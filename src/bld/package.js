import fs from "node:fs/promises";

import { compress } from "./compress.js";
import { setLinuxConfig } from "./linuxCfg.js";
import { setOsxConfig } from "./osxCfg.js";
import { setWinConfig } from "./winCfg.js";

/**
 * Generate NW build artifacts
 *
 * @param  {string}                  srcDir       Directory to hold NW development files
 * @param  {string}                  nwDir        Directory to hold NW binaries
 * @param  {string}                  outDir       Directory to store build artifacts
 * @param  {"linux" | "osx" | "win"} platform     Platform is the operating system type
 * @param  {"zip" | boolean}         zip          Specify if the build artifacts are to be zipped
 * @param  {object}                  releaseInfo  NW version specific release information
 * @return {undefined}
 */
const packager = async (srcDir, nwDir, outDir, platform, zip, releaseInfo) => {
  await fs.rm(outDir, { force: true, recursive: true });
  await fs.cp(nwDir, outDir, { recursive: true });
  await fs.cp(
    srcDir,
    `${outDir}/${
      platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"
    }`,
    {
      recursive: true,
    },
  );

  let buffer = await fs.readFile(
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
      setOsxConfig(pkg, outDir, releaseInfo);
      break;
    default:
      break;
  }

  if (zip === true) {
    await compress(outDir);
  } else if (zip === "zip") {
    await compress(outDir, zip);
  }
};

export { packager };
