import path from "node:path";

import semver from "semver";

import request from "./request.js";

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
   * Name of directory which contains Node headers.
   * @type {string}
   */
  const nodeDir = `node-v${version}`;

  /**
   * Name of compressed file which contains Node headers.
   * @type {string}
   */
  const nwFile = `${nodeDir}.tar.gz`;

  /**
   * Prefix of Node headers file name. For reference: [nwjs/nw.js@471e406](https://github.com/nwjs/nw.js/blob/471e406/lib/node.js)
   * @type {string}
   */
  const headersPrefix = semver.gte(version, "0.111.3") ? "node" : "nw-headers";

  /**
   * URL to download specific Node headers from.
   * @type {string}
   */
  const url = [
    downloadUrl,
    `v${version}`,
    `${headersPrefix}-v${version}.tar.gz`,
  ].join("/");

  /**
   * Absolute path of compressed file which contains Node headers.
   */
  const nwFileAbs = path.resolve(cacheDir, nwFile);

  await request(url, nwFileAbs);
  return nwFileAbs;
}
