import { access, constants } from "node:fs/promises";

/**
 * Check if NW binaries are cached
 *
 * @param  {string}  nwDir  Path to cached NW binaries
 * @return {boolean}        Boolean value to denote if cache exists or not
 */
export const isCached = async (nwDir) => {
  let exists = true;
  try {
    await access(nwDir, constants.F_OK);
  } catch (e) {
    exists = false;
  }
  return exists;
};
