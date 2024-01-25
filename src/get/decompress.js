import tar from "tar";

import util from "../util.js";

/**
 * Decompresses a file at `filePath` to `outDir` directory.
 * 
 * @param {string} filePath - file path to compressed binary
 * @param {string} outDir - directory to decompress into
 */
export default async function decompress(filePath, outDir) {
    if (filePath.endsWith(".zip")) {
        await util.unzip(filePath, outDir);
    } else {
        await tar.extract({
            file: filePath,
            C: outDir
        });
    }
}
