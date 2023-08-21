import { resolve } from "node:path";
import { cp, rm, writeFile } from "node:fs/promises";

import compressing from "compressing";

import { log } from "../log.js";

import { setLinuxConfig } from "./linuxCfg.js";
import { setOsxConfig } from "./osxCfg.js";
import { setWinConfig } from "./winCfg.js";

/**
 * Generate NW build artifacts
 *
 * @param  {string | string[]}       files     Array of NW app files
 * @param  {string}                  nwDir     Directory to hold NW binaries
 * @param  {string}                  outDir    Directory to store build artifacts
 * @param  {"linux" | "osx" | "win"} platform  Platform is the operating system type
 * @param  {"zip" | boolean}         zip       Specify if the build artifacts are to be zipped
 * @param  {object}                  app       Multi platform configuration options
 * @param  {string}                  nwPkg     NW.js manifest file
 * @return {Promise<undefined>}
 */
export const build = async (
  files,
  nwDir,
  outDir,
  platform,
  zip,
  app,
  nwPkg,
) => {
  log.debug(`Remove any files at ${outDir} directory`);
  await rm(outDir, { force: true, recursive: true });
  log.debug(`Copy ${nwDir} files to ${outDir} directory`);
  await cp(nwDir, outDir, { recursive: true, verbatimSymlinks: true });

  log.debug(`Copy files in srcDir to ${outDir} directory`);

  if (typeof files === "string") {
    await cp(
      files,
      resolve(
        outDir,
        platform !== "osx"
          ? "package.nw"
          : "nwjs.app/Contents/Resources/app.nw",
      ),
      { recursive: true, verbatimSymlinks: true },
    );
  } else {
    for (let file of files) {
      log.debug(`Copy ${file} file to ${outDir} directory`);
      await cp(
        file,
        resolve(
          outDir,
          platform !== "osx"
            ? "package.nw"
            : "nwjs.app/Contents/Resources/app.nw",
          file,
        ),
        { recursive: true, verbatimSymlinks: true },
      );
    }
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
      await setOsxConfig(app, outDir);
      break;
    default:
      break;
  }

  if (zip !== false) {
    if (zip === true || zip === "zip") {
      await compressing.zip.compressDir(outDir, `${outDir}.zip`);
    } else if (zip === "tar") {
      await compressing.tar.compressDir(outDir, `${outDir}.tar`);
    } else if (zip === "tgz") {
      await compressing.tgz.compressDir(outDir, `${outDir}.tgz`);
    }

    await rm(outDir, { recursive: true, force: true });
  }
};
