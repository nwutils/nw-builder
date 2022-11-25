import { access, constants, mkdir, rm } from "node:fs/promises";

import { decompress } from "./get/decompress.js";
import { develop } from "./run/develop.js";
import { download } from "./get/download.js";
import { getReleaseInfo } from "./get/getReleaseInfo.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";
import { parseOptions } from "./util/parse.js";
import { validateOptions } from "./util/validate.js";

import { log } from "./log.js";

export const nwbuild = async (options) => {

  options = await parseOptions(options);

  try {
    await mkdir(`${options.cacheDir}`, { recursive: false });
  } catch(e) {
    log.warn(e);
  }

  let releaseInfo = await getReleaseInfo(options.version, options.cacheDir, options.manifestUrl);

  console.log(releaseInfo)

  options = await validateOptions(options, releaseInfo);

  let nwDir = `${options.cacheDir}/nwjs${
    options.flavour === "sdk" ? "-sdk" : ""
  }-v${options.version}-${options.platform}-${options.arch}`;

  let fileExists = true;

  try {
    await access(nwDir, constants.F_OK);
  } catch (e) {
    fileExists = false;
  }

  if (options.cache === false || fileExists === false) {
    await rm(nwDir, { force: true, recursive: true });
    await download(options.version, options.flavour, options.platform, options.arch, options.downloadUrl, options.cacheDir);
    await decompress(options.platform, options.cacheDir);
    await remove(options.platform, options.cacheDir);
  }

  if (options.mode === "run") {
    await develop(options.srcDir, options.nwDir, options.platform);
  }
  if (options.mode === "build") {
    await packager(options.srcDir, nwDir, options.outDir, options.platform, options.zip, releaseInfo);
  } else {
    log.error("Invalid value used for mode. Expected either `run` or `build`");
  }
};
