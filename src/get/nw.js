import path from 'node:path';

import request from './request.js';

/**
 * Download NW.js binary.
 * @param  {string}          downloadUrl  - Download server
 * @param  {string}          version      - Runtime version
 * @param  {string}          flavor       - Runtime build flavor
 * @param  {string}          platform     - NW supported platform
 * @param  {string}          arch         - NW supported architecture
 * @param  {string}          cacheDir     - Directory to store NW binaries
 * @returns {Promise<string>}              - path of compressed file which contains NW.js binaries.
 */
export default async function nw(downloadUrl, version, flavor, platform, arch, cacheDir) {

  /**
   * Name of directory which contains NW.js binaries.
   * @type {string}
   */
  const nwDir = [
    'nwjs',
    flavor === 'sdk' ? '-sdk' : '',
    `-v${version}-${platform}-${arch}`,
  ].join('');

  /**
   * Name of compressed file which contains NW.js binaries.
   * @type {string}
   */
  const nwFile = [
    nwDir,
    platform === 'linux' ? 'tar.gz' : 'zip'
  ].join('.');

  /**
   * URL to download specific NW.js binary from.
   * @type {string}
   */
  const url = [
    downloadUrl,
    `v${version}`,
    nwFile,
  ].join('/');

  /**
   * Absolute path of compressed file which contains NW.js binaries.
   */
  const nwFileAbs = path.resolve(
    cacheDir,
    nwFile
  );
  await request(url, nwFileAbs);

  return nwFileAbs;
}
