import { resolve } from "node:path";
import { cp, rm } from "node:fs/promises";

import { log } from "../log.js";

import { compress } from "./compress.js";
import { setLinuxConfig } from "./linuxCfg.js";
import { setOsxConfig } from "./osxCfg.js";
import { setWinConfig } from "./winCfg.js";

/**
 * Generate NW build artifacts
 *
 * @param  {string[]}                files        Array of NW app files
 * @param  {string}                  nwDir        Directory to hold NW binaries
 * @param  {string}                  outDir       Directory to store build artifacts
 * @param  {"linux" | "osx" | "win"} platform     Platform is the operating system type
 * @param  {"zip" | boolean}         zip          Specify if the build artifacts are to be zipped
 * @param  {object}                  releaseInfo  NW version specific release information
 * @param  {object}                  app          Multi platform configuration options
 * @return {Promise<undefined>}
 */
export const build = async (
  files,
  nwDir,
  outDir,
  platform,
  zip,
  releaseInfo,
  app,
) => {
  log.debug(`Remove any files at ${outDir} directory`);
  await rm(outDir, { force: true, recursive: true });
  log.debug(`Copy ${nwDir} files to ${outDir} directory`);
  await cp(nwDir, outDir, { recursive: true });

  log.debug(`Copy files in srcDir to ${outDir} directory`);
  for (let file of files) {
    let filePath = "";
    if (file.split("/").length === 2) {
      filePath = file;
    } else {
      filePath = file.split("/").splice(2).join("/");
    }
    log.debug(`Copy ${file} file to ${outDir} directory`);
    await cp(
      file,
      resolve(
        outDir,
        platform !== "osx"
          ? "package.nw"
          : "nwjs.app/Contents/Resources/app.nw",
        filePath,
      ),
    );
  }

  log.debug(`Starting platform specific config steps for ${platform}`);
  switch (platform) {
    case "linux":
      await setLinuxConfig(app, outDir);
      break;
    case "win":
      await setWinConfig(app, outDir);
      break;
    case "osx":
      await setOsxConfig(app, outDir, releaseInfo);
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