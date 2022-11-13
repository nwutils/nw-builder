import fs from "node:fs/promises";
import { decompress } from "./get/decompress.js";
import { develop } from "./run/develop.js";
import { download } from "./get/download.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";

/**
 * Options schema
 * @typedef {Object} OptionsSchema
 * @property {string} srcDir
 * @property {string} cacheDir
 * @property {string} version
 * @property {"sdk" | "normal"} flavour
 * @property {"linux" | "osx" | "win"} platform
 * @property {"ia32" | "x64"} arch
 * @property {string} outDir
 */

/**
 *
 * @param {OptionsSchema} obj
 * @return {void}
 */
const nwbuild = async ({
  srcDir,
  cacheDir = "./cache",
  version,
  flavour,
  platform,
  arch,
  outDir,
  // flags
  downloadUrl = "https://dl.nwjs.io",
  // manifestUrl = "https://nwjs.io/versions",
  noCache = false,
  zip = false,
  run = false,
}) => {
  let pkgPath = `${srcDir}/package.json`;
  let pkgExist = true;
  let pkgData = null;

  try {
    await fs.access(pkgPath, fs.constants.F_OK);
  } catch (e) {
    pkgExist = false;
  }

  if (pkgExist === true) {
    pkgData = await fs.readFile(pkgPath, "utf8");
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
    await fs.access(nwDir, fs.constants.F_OK);
  } catch (e) {
    fileExists = false;
  }

  if (noCache === true || fileExists === false) {
    await fs.rm(nwDir, { force: true, recursive: true });
    await download(version, flavour, platform, arch, downloadUrl, cacheDir);
    await decompress(platform, cacheDir);
    await remove(platform, cacheDir);
  }

  if (run === true) {
    await develop(srcDir, nwDir, platform);
  } else {
    await packager(srcDir, nwDir, outDir, platform, zip);
  }
};

export { nwbuild };
