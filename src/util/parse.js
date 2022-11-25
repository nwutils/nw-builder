import { readFile } from "node:fs/promises";
import { cwd } from "node:process";

/**
 * Parse options
 *
 * @param  {object}                       options              lorem ipsum
 * @param  {"run" | "build"}              options.mode         lorem ipsum
 * @param  {"latest" | "stable" | string} options.version      lorem ipsum
 * @param  {"normal" | "sdk"}             options.flavour      lorem ipsum
 * @param  {"linux" | "osx" | "win"}      options.platform     lorem ipsum
 * @param  {"ia32" | "x64"}               options.arch         lorem ipsum
 * @param  {string}                       options.outDir       lorem ipsum
 * @param  {"./cache" | string}           options.cacheDir     lorem ipsum
 * @param  {"https://dl.nwjs.io"}         options.downloadUrl  lorem ipsum
 * @param  {"https://nwjs.io/versions"}   options.manifestUrl  lorem ipsum
 * @param  {boolean}                      options.cache        lorem ipsum
 * @param  {boolean}                      options.zip          lorem ipsum
 * @return {object}                                            lorem ipsum
 */
export const parseOptions = async (options) => {
  let pkg = undefined;
  pkg = await readFile(`${options.srcDir}/package.json`);
  pkg = JSON.parse(pkg);
  let pkgOptions = pkg.nwbuild;
  if (pkgOptions !== undefined) {
    options = { ...pkgOptions };
  }

  if (options.flavor !== undefined) {
    options.flavour = options.flavor;
  }

  // Assign flags with their default value unless overriden by user
  options.cacheDir = options.cacheDir ?? `${cwd()}/cache`;
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.cache = options.cache ?? true;
  options.glob = options.glob ?? false;
  options.zip = options.zip ?? false;
  return options;
};
