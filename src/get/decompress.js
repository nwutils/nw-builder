import fs from "node:fs";
import path from "node:path";
import stream from "node:stream";

import tar from "tar";
import yauzl from "yauzl-promise";
import {ensureSymlink} from "fs-extra";

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
export async function unzip(zippedFile, cacheDir) {
  await unzipInternal(zippedFile, cacheDir, false).then(() => {
    unzipInternal(zippedFile, cacheDir, true);
  })
}

/**
 * Method for unzip with symlink in theoretical
 *
 * @async
 * @function
 * @param                  unzipSymlink
 * @param  {string}        zippedFile    - file path to .zip file
 * @param  {string}        cacheDir      - directory to unzip in
 * @param  {boolean}       unzipSymlink  - Using or not symlink
 * @return {Promise<void>}
 */
async function unzipInternal(zippedFile, cacheDir, unzipSymlink )  {
  const zip = await yauzl.open(zippedFile);

  let entry = await zip.readEntry();

  while (entry !== null) {
    // console.log(entry)
    let entryPathAbs = path.join(cacheDir, entry.filename);
    // Create the directory beforehand to prevent `ENOENT: no such file or directory` errors.
    await fs.promises.mkdir(path.dirname(entryPathAbs), {recursive: true});
    const readStream = await entry.openReadStream();

    try {
      if (!unzipSymlink) {
        // Regular method and silent error at this point
        const writeStream = fs.createWriteStream(entryPathAbs);
        await stream.promises.pipeline(readStream, writeStream);
      } else {
        // Need check before if file is a symlink or not at this point
        const pathContent = await fs.promises.lstat(entryPathAbs);

        if (pathContent.isSymbolicLink()) {
          const chunks = [];
          readStream.on('data', (chunk) => chunks.push(chunk));
          await stream.promises.finished(readStream);
          // need fetch value of current symlink here
          const linkTarget = Buffer.concat(chunks).toString('utf8').trim();
          await ensureSymlink(entryPathAbs, path.join(path.dirname(entryPathAbs), linkTarget));
        }else{
          // Regular method and silent error at this point
          const writeStream = fs.createWriteStream(entryPathAbs);
          await stream.promises.pipeline(readStream, writeStream);
        }
      }
    } catch (error) {
      if (unzipSymlink) {
        console.error(error);
      }
    }

    entry = await zip.readEntry();
  }

  await zip.close();
}
