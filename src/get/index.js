import fs from "node:fs";

import util from "../util.js";

import decompress from "./decompress.js";
import nw from "./nw.js";

/**
 * 
 * @param {string} downloadUrl 
 * @param {string} version 
 * @param {string} flavor 
 * @param {string} platform 
 * @param {string} arch 
 * @param {string} cacheDir 
 * @param {boolean} cache
 * @param {boolean} ffmpeg
 */
export default async function get(downloadUrl, version, flavor, platform, arch, cacheDir, cache, ffmpeg) {
    if (cache === false) {
        await fs.promises.rm(cacheDir, {
            recursive: true,
            force: true,
        });
    }

    const exists = await util.fileExists(cacheDir)
    let nwFile = '';

    if (exists === false) {
        nwFile = await nw(downloadUrl, version, flavor, platform, arch, cacheDir);
    }

    await decompress(nwFile, cacheDir);

    if ()

}
