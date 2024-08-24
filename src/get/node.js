import path from 'node:path';

import request from './request.js';

/**
 * Download NW.js's Node.js headers.
 * @param  {string}          downloadUrl  - Download server
 * @param  {string}          version      - Runtime version
 * @param  {string}          cacheDir     - Directory to store NW binaries
 * @returns {Promise<string>}              - path of compressed file which contains the Node headers.
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
   * URL to download specific Node headers from.
   * @type {string}
   */
  const url = [
    downloadUrl,
    `v${version}`,
    `nw-headers-v${version}.tar.gz`
  ].join('/');

  /**
   * Absolute path of compressed file which contains Node headers.
   */
  const nwFileAbs = path.resolve(
    cacheDir,
    nwFile
  );
  await request(url, nwFileAbs);

  return nwFileAbs;
}
