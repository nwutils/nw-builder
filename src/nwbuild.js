import { access, constants, readFile, rm } from "node:fs/promises";
import { cwd } from "node:process";

import { decompress } from "./get/decompress.js";
import { develop } from "./run/develop.js";
import { download } from "./get/download.js";
import { getReleaseInfo } from "./get/getReleaseInfo.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";

/**
 * Options schema
 *
 * @typedef {Object} OptionsSchema
 * @property {string}                  srcDir
 * @property {string}                  cacheDir
 * @property {string}                  version
 * @property {"sdk" | "normal"}        flavour
 * @property {"linux" | "osx" | "win"} platform
 * @property {"ia32" | "x64"}          arch
 * @property {string}                  outDir
 */

/**
 *
 * @param  {OptionsSchema} obj
 * @return {void}
 */
const nwbuild = async ({
  srcDir,
  cacheDir = `${cwd()}/cache`,
  version,
  flavour,
  platform,
  arch,
  outDir,
  // flags
  downloadUrl = "https://dl.nwjs.io",
  manifestUrl = "https://nwjs.io/versions",
  noCache = false,
  zip = false,
  run = false,
}) => {
  let pkgPath = `${srcDir}/package.json`;
  let pkgExist = true;
  let pkgData = null;

  try {
    await access(pkgPath, constants.F_OK);
  } catch (e) {
    pkgExist = false;
  }

  if (pkgExist === true) {
    pkgData = await readFile(pkgPath, "utf8");
    pkgData = JSON.parse(pkgData);
    if (pkgData.nwbuild !== undefined) {
      srcDir = pkgData.nwbuild.srcDir ?? srcDir;
      cacheDir = pkgData.nwbuild.cacheDir ?? cacheDir;
      version = pkgData.nwbuild.version ?? version;
      flavour = pkgData.nwbuild.flavour ?? flavour;
      platform = pkgData.nwbuild.platform ?? platform;
      arch = pkgData.nwbuild.arch ?? arch;
      outDir = pkgData.nwbuild.outDir ?? outDir;
    }
  }

  let nwDir = `${cacheDir}/nwjs${
    flavour === "sdk" ? "-sdk" : ""
  }-v${version}-${platform}-${arch}`;

  let fileExists = true;

  try {
    await access(nwDir, constants.F_OK);
  } catch (e) {
    fileExists = false;
  }

  if (noCache === true || fileExists === false) {
    await rm(nwDir, { force: true, recursive: true });
    await download(version, flavour, platform, arch, downloadUrl, cacheDir);
    await decompress(platform, cacheDir);
    await remove(platform, cacheDir);
  }

  let releaseInfo = await getReleaseInfo(version, cacheDir, manifestUrl);

  if (run === true) {
    await develop(srcDir, nwDir, platform);
  } else {
    await packager(srcDir, nwDir, outDir, platform, zip, releaseInfo);
  }
};

export { nwbuild };
