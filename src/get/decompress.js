import fs from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';

import * as tar from 'tar';
import yauzl from 'yauzl-promise';

/**
 * Decompresses a file at `filePath` to `cacheDir` directory.
 * @param {string} filePath  - file path to compressed binary
 * @param {string} cacheDir  - directory to decompress into
 */
export default async function decompress(filePath, cacheDir) {
  if (filePath.endsWith('.zip')) {
    await unzip(filePath, cacheDir);
  } else {
    await tar.extract({
      file: filePath,
      C: cacheDir
    });
  }
}

/**
 * Get file mode from entry. Reference implementation is [here](https://github.com/fpsqdb/zip-lib/blob/ac447d269218d396e05cd7072d0e9cd82b5ec52c/src/unzip.ts#L380).
 * @param  {yauzl.Entry} entry  - Yauzl entry
 * @returns {number}             - entry's file mode
 */
function modeFromEntry(entry) {
  const attr = entry.externalFileAttributes >> 16 || 33188;

  return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
    .map(mask => attr & mask)
    .reduce((a, b) => a + b, attr & 61440 /* S_IFMT */);
}

/**
 * Unzip `zippedFile` to `cacheDir`.
 * @async
 * @function
 * @param  {string}        zippedFile  - file path to .zip file
 * @param  {string}        cacheDir    - directory to unzip in
 * @returns {Promise<void>}
 */
async function unzip(zippedFile, cacheDir) {
  const zip = await yauzl.open(zippedFile);
  let entry = await zip.readEntry();
  const symlinks = []; // Array to hold symbolic link entries

  while (entry !== null) {
    let entryPathAbs = path.join(cacheDir, entry.filename);
    // Check if entry is a symbolic link
    const isSymlink = ((modeFromEntry(entry) & 0o170000) === 0o120000);

    if (isSymlink) {
      // Store symlink entries to process later
      symlinks.push(entry);
    } else {
      // Handle regular files and directories
      await fs.promises.mkdir(path.dirname(entryPathAbs), {recursive: true});
      if (!entry.filename.endsWith('/')) { // Skip directories
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(entryPathAbs);
        await stream.promises.pipeline(readStream, writeStream);

        // Set file permissions after the file has been written
        const mode = modeFromEntry(entry);
        await fs.promises.chmod(entryPathAbs, mode);
      }
    }

    // Read next entry
    entry = await zip.readEntry();
  }

  // Process symbolic links after all other files have been extracted
  for (const symlinkEntry of symlinks) {
    let entryPathAbs = path.join(cacheDir, symlinkEntry.filename);
    const readStream = await symlinkEntry.openReadStream();
    const chunks = [];
    readStream.on('data', (chunk) => chunks.push(chunk));
    await new Promise(resolve => readStream.on('end', resolve));
    const linkTarget = Buffer.concat(chunks).toString('utf8').trim();

    // Check if the symlink or a file/directory already exists at the destination
    if (fs.existsSync(entryPathAbs)) {
      //skip
    } else {
      // Create symbolic link
      await fs.promises.symlink(linkTarget, entryPathAbs);
    }
  }
  await zip.close();
}
