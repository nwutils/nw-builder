import path from "node:path";

import request from "./request.js";

/**
 * Download community FFpeg binary from `https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt`.
 *
 * @param  {string}          downloadUrl  - Download server
 * @param  {string}          version      - Runtime version
 * @param  {string}          platform     - NW supported platform
 * @param  {string}          arch         - NW supported architecture
 * @param  {string}          cacheDir     - Directory to store NW binaries
 * @return {Promise<string>}              - path of compressed file which contains NW.js binaries.
 */
export default async function ffmpeg(downloadUrl, version, platform, arch, cacheDir) {

  /**
   * URL to download specific NW.js binary from.
   *
   * @type {string}
   */
  const url = [
    downloadUrl,
    version,
    `${version}-${platform}-${arch}.zip`,
  ].join('/');

  /**
   * Absolute path of compressed file which contains NW.js binaries.
   */
  const ffmpegFileAbs = path.resolve(
    cacheDir,
    `ffmpeg-${version}-${platform}-${arch}.zip`,
  );
  await request(url, ffmpegFileAbs);

  return ffmpegFileAbs;
}
