import { readFile } from "node:fs/promises";
import { basename } from "node:path";

import glob from "glob-promise";

import { log } from "../log.js";

/**
 * Get options object from package.json, otherwise from module/cli
 *
 * @param  {import("../nwbuild").Options} opts  The options object
 * @return {Promise<object>}                    The options object
 */
export const getOptions = async (opts) => {
  let files = [];
  let nwPkg;
  const patterns = opts.srcDir.split(" ");

  // If the cli option is not true, then the srcDir glob patterns have not been parsed
  if (opts.cli !== true) {
    for (const pattern of patterns) {
      let contents = await glob(pattern);
      files.push(...contents);
    }
  } else {
    files = [...patterns];
  }

  // Try to find the first instance of the package.json
  for (const file of files) {
    if (basename(file) === "package.json" && nwPkg === undefined) {
      nwPkg = JSON.parse(await readFile(file));
    }
  }

  if (nwPkg === undefined) {
    throw new Error("package.json not found in srcDir file glob patterns.");
  }

  if (files.length === 0) {
    throw new Error(`The globbing pattern ${opts.srcDir} is invalid.`);
  }

  // If the nwbuild property exists in srcDir/package.json, then they take precedence
  if (typeof nwPkg.nwbuild === "object") {
    opts = { ...nwPkg.nwbuild };
  } else if (typeof nwPkg.nwbuild === "undefined") {
    log.debug(`nwbuild property is not defined in package.json`);
  } else {
    throw new Error(
      `nwbuild property in the package.json is of type ${typeof nwPkg.nwbuild}. Expected type object.`,
    );
  }

  return { opts, files, nwPkg };
};
