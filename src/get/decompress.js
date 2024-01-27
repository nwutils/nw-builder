import fs from "node:fs";
import path from "node:path";
import stream from "node:stream";

import tar from "tar";
import yauzl from "yauzl-promise";

/**
 * Decompresses a file at `filePath` to `cacheDir` directory.
 *
 * @param {string} filePath  - file path to compressed binary
 * @param {string} cacheDir  - directory to decompress into
 */
export default async function decompress(filePath, cacheDir) {
  if (filePath.endsWith(".zip")) {
    await unzip(filePath, cacheDir);
  } else {
    await tar.extract({
      file: filePath,
      C: cacheDir
    });
  }
}

/**
 * Wrapper for unzipping using `yauzl-promise`.
 *
 * @async
 * @function
 * @param  {string}        zippedFile  - file path to .zip file
 * @param  {string}        cacheDir    - directory to unzip in
 * @return {Promise<void>}
 */
async function unzip(zippedFile, cacheDir) {
  const zip = await yauzl.open(zippedFile);

  let entry = await zip.readEntry();

  while (entry !== null) {
    let entryPathAbs = path.resolve(cacheDir, entry.filename);

    const readStream = await entry.openReadStream();
    const writeStream = fs.createWriteStream(entryPathAbs);
    await stream.promises.pipeline(readStream, writeStream);

    entry = await zip.readEntry();
  }

  await zip.close();
}
