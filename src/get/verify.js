import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import request from './request.js';

console.log(await verify('0.89.0', 'sdk', 'linux', 'x64', './node_modules/nw'))

/**
 * Verify the integrity of the NW.js binary after downloading and before decompressing.
 * @param {string} version
 * @param {string} flavor
 * @param {string} platform
 * @param {string} arch
 * @param {string} cacheDir
 * @returns {Promise<void>}
 */
export default async function verify(version, flavor, platform, arch, cacheDir) {

    const nwDir = [
        `nwjs`,
        flavor === 'sdk' ? '-sdk' : '',
        `-v${version}-${platform}-${arch}`,
      ].join('');

      const nwFile = [
        nwDir,
        platform === 'linux' ? "tar.gz" : "zip"
      ].join('.');

    /* Download text file which contains SHA256 checksum. */
    const sha256url = `https://dl.nwjs.io/v${version}/SHASUMS256.txt`;
    const sha256out = path.resolve(cacheDir, `nwjs-v${version}-${platform}-${arch}-SHASUM256.txt`);
    await request(sha256url, sha256out);

    /* Generate SHA256 checksum of downloaded file. */
    const fileBuffer = await fs.promises.readFile(path.resolve(cacheDir, nwFile));
    const computedChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const downloadChecksums = await fs.promises.readFile(sha256out, {encoding: 'utf-8'});
    for (const line of downloadChecksums.split('\n')) {
        const [hex, file] = line.split('  ');
        if (file === nwFile) {
            if (hex === computedChecksum) {
                return true;
            }
        }
    }
    return false;
}