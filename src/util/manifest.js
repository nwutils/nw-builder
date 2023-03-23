import { readFile } from "node:fs/promises";
import { basename } from "node:path";

/**
 * Get options object from package.json, otherwise from module/cli
 *
 * @param  {Array[]}         files  Array of file paths
 * @return {Promise<object>}        NW.js manifest file
 */
export const getManifest = async (files) => {
  let manifest;

  // Try to find the first instance of the package.json
  for (const file of files) {
    if (basename(file) === "package.json" && manifest === undefined) {
      manifest = JSON.parse(await readFile(file));
    }
  }

  if (manifest === undefined) {
    throw new Error("package.json not found in srcDir file glob patterns.");
  }

  return manifest;
};
