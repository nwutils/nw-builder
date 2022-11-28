import { readFile } from "node:fs/promises";
import { cwd } from "node:process";

/**
 * Parse options from user input via module or cli
 *
 * @param  {object}                       options              lorem ipsum
 * @param  {"run" | "build"}              options.mode         lorem ipsum
 * @param  {"latest" | "stable" | string} options.version      lorem ipsum
 * @param  {"normal" | "sdk"}             options.flavour      lorem ipsum
 * @param  {"normal" | "sdk"}             options.flavor       lorem ipsum
 * @param  {"linux" | "osx" | "win"}      options.platform     lorem ipsum
 * @param  {"ia32" | "x64"}               options.arch         lorem ipsum
 * @param  {string}                       options.outDir       lorem ipsum
 * @param  {"./cache" | string}           options.cacheDir     lorem ipsum
 * @param  {"https://dl.nwjs.io"}         options.downloadUrl  lorem ipsum
 * @param  {"https://nwjs.io/versions"}   options.manifestUrl  lorem ipsum
 * @param  {boolean}                      options.cache        lorem ipsum
 * @param  {boolean}                      options.zip          lorem ipsum
 * @return {Promise<object | Error>}                           lorem ipsum
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
