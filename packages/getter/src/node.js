import path from "node:path";

import semver from "semver";

import request from "./request.js";

/**
 * Name of the Node headers tarball, as both the download URL and the
 * SHASUMS256.txt checksum entry for `version` refer to it. For reference:
 * [nwjs/nw.js@471e406](https://github.com/nwjs/nw.js/blob/471e406/lib/node.js)
 * @param  {string} version  - Runtime version
 * @returns {string}          - eg. "node-v0.111.3.tar.gz" or "nw-headers-v0.107.0.tar.gz"
 */
export function headersFileName(version) {
  const headersPrefix = semver.gte(version, "0.111.3") ? "node" : "nw-headers";
  return `${headersPrefix}-v${version}.tar.gz`;
}

/**
 * Download NW.js's Node.js headers.
 * @async
 * @function
 * @param  {string}          downloadUrl  - Download server
 * @param  {string}          version      - Runtime version
 * @param  {string}          cacheDir     - Directory to store NW binaries
 * @throws {Error}                        - When download fails
 * @returns {Promise<string>}             - path of compressed file which contains the Node headers.
 */
export default async function nw(downloadUrl, version, cacheDir) {
  /**
   * Name of compressed file which contains Node headers. Saved locally under
   * the same name it's listed under in SHASUMS256.txt, so its checksum can
   * actually be looked up later.
   * @type {string}
   */
  const nwFile = headersFileName(version);

  /**
   * URL to download specific Node headers from.
   * @type {string}
   */
  const url = [downloadUrl, `v${version}`, nwFile].join("/");

  /**
   * Absolute path of compressed file which contains Node headers.
   */
  const nwFileAbs = path.resolve(cacheDir, nwFile);

  await request(url, nwFileAbs);
  return nwFileAbs;
}
