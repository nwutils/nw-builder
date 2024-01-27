import tar from "tar";

import util from "../util.js";

/**
 * Decompresses a file at `filePath` to `outDir` directory.
 * 
 * @param {string} filePath - file path to compressed binary
 * @param {string} cacheDir - directory to decompress into
 */
export default async function decompress(filePath, cacheDir) {
    if (filePath.endsWith(".zip")) {
        await util.unzip(filePath, cacheDir);
    } else {
        await tar.extract({
            file: filePath,
            C: cacheDir
        });
    }
}
