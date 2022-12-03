import { readFile } from "node:fs/promises";
import { cwd } from "node:process";

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

  options.srcDir = options.srcDir ?? undefined;
  options.version = options.version ?? undefined;
  options.flavour = options.flavour ?? undefined;
  options.platform = options.platform ?? undefined;
  options.arch = options.arch ?? undefined;
  options.outDir = options.outDir ?? undefined;
  options.cacheDir = options.cacheDir ?? `${cwd()}/cache`;
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.cache = options.cache ?? true;
  options.zip = options.zip ?? false;
  return options;
};
