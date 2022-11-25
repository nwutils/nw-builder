import { readFile } from "node:fs/promises";
import { cwd } from "node:process";

export const parseOptions = async (options) => {
  console.log(options)
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
