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
 * Get file mode from entry.
 * Ref: https://github.com/fpsqdb/zip-lib/blob/ac447d269218d396e05cd7072d0e9cd82b5ec52c/src/unzip.ts#L380
 *
 * @param  {yauzl.Entry} entry  - Yauzl entry
 * @return {number}             - entry's file mode 
 */
function modeFromEntry(entry) {
  const attr = entry.externalFileAttributes >> 16 || 33188;

  return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
    .map(mask => attr & mask)
    .reduce((a, b) => a + b, attr & 61440 /* S_IFMT */);
}

/**
 * Unzip `zippedFile` to `cacheDir`.
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

  let fileMode = modeFromEntry(entry);

  const isSymlink = ((fileMode & 0o170000) === 0o120000);

  while (entry !== null) {
    let entryPathAbs = path.join(cacheDir, entry.filename);
    // Create the directory beforehand to prevent `ENOENT: no such file or directory` errors.
    await fs.promises.mkdir(path.dirname(entryPathAbs), { recursive: true });

    if (isSymlink) {
      const buffer = await fs.promises.readFile(entryPathAbs);
      const link = buffer.toString();
      await fs.promises.symlink(link, entryPathAbs);
    } else {
      // Pipe read to write stream
      const readStream = await entry.openReadStream();
      const writeStream = fs.createWriteStream(entryPathAbs);
      await stream.promises.pipeline(readStream, writeStream);
    }

    // Read next entry
    entry = await zip.readEntry();
  }
}
