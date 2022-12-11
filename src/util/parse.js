import { readFile } from "node:fs/promises";
import { arch, cwd, platform } from "node:process";

import { getArch } from "./arch.js";
import { getPlatform } from "./platform.js";

/**
 * Parse options
 *
 * @param  {object}          options  Options
 * @return {Promise<object>}          Options
 */
export const parse = async (options) => {
  let pkg = undefined;
  try {
    pkg = await readFile(`${options.srcDir}/package.json`);
  } catch (e) {
    // log.warn(e);
  }

  if (typeof pkg?.nwbuild === "object") {
    options = { ...pkg.nwbuild };
  }

  if (options.flavor !== undefined) {
    options.flavour = options.flavor;
  }

  options.srcDir = options.srcDir ?? "./";
  options.mode = options.mode ?? "build";
  options.version = options.version ?? "latest";
  options.flavour = options.flavour ?? "sdk";
  options.platform = options.platform ?? getPlatform(platform);
  options.arch = options.arch ?? getArch(arch);
  options.outDir = options.outDir ?? "./out";
  options.cacheDir = options.cacheDir ?? `${cwd()}/cache`;
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.cache = options.cache ?? true;
  options.zip = options.zip ?? false;
  return options;
};
