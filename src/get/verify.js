import path from 'node:path';

import request from './request';

/**
 * Verify the integrity of the NW.js binary after downloading and before decompressing.
 * @version {string}
 */
export default async function verify(version, cacheDir) {
    const sha256url = `https://dl.nwjs.io/v${version}/SHASUMS256.txt`;
    const sha256out = path.resolve(cacheDir);
    await request(sha256url, sha256out);
}