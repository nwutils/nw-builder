import fs from "node:fs";
import path from "node:path";
import stream from "node:stream";

import * as tar from "tar";
import yauzl from "yauzl-promise";

/**
 * Decompresses a file at `filePath` to `cacheDir` directory.
 * @async
 * @function
 * @param {string} filePath  - file path to compressed binary
 * @param {string} cacheDir  - directory to decompress into
 * @throws {Error}
 * @returns {Promise<void>}
 */
export default async function decompress(filePath, cacheDir) {
  if (filePath.endsWith(".zip")) {
    /*
     * Every entry unzip() writes is resolved through resolveWithin() first -
     * file entries, symlink names and symlink targets alike. The rule reports
     * the call site rather than the write site, so it cannot see that guard
     * from here.
     */
    // eslint-disable-next-line node-security/no-zip-slip
    await unzip(filePath, cacheDir);
  } else {
    /*
     * node-tar v7 strips `..` segments and absolute paths itself unless
     * `preservePaths` is set, and it is not set here.
     */
    // eslint-disable-next-line node-security/no-zip-slip
    await tar.extract({
      file: filePath,
      C: cacheDir,
    });
  }
}

/**
 * Prevent any `entryName` from escaping the `root` leading to Zip Slip via the symlink.
 *
 * @param {string} root       - directory every entry must stay within
 * @param {string} entryName  - entry name as recorded in the archive
 * @throws {Error}             - when the entry resolves outside `root`
 * @returns {string}           - the safe absolute path
 */
function resolveWithin(root, entryName) {
  const rootAbs = path.resolve(root);
  const target = path.resolve(rootAbs, entryName);
  if (target !== rootAbs && !target.startsWith(rootAbs + path.sep)) {
    throw new Error(
      `Refusing to extract ${JSON.stringify(entryName)}: it resolves outside the destination directory.`,
    );
  }
  return target;
}

/**
 * Get file mode from entry. Reference implementation is [here](https://github.com/fpsqdb/zip-lib/blob/ac447d269218d396e05cd7072d0e9cd82b5ec52c/src/unzip.ts#L380).
 * @async
 * @function
 * @param  {yauzl.Entry} entry  - Yauzl entry
 * @returns {number}             - entry's file mode
 */
function modeFromEntry(entry) {
  const attr = entry.externalFileAttributes >> 16 || 33188;

  return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
    .map((mask) => attr & mask)
    .reduce((a, b) => a + b, attr & 61440 /* S_IFMT */);
}

/**
 * Unzip `zippedFile` to `cacheDir`.
 * @async
 * @function
 * @param  {string}        zippedFile  - file path to .zip file
 * @param  {string}        cacheDir    - directory to unzip in
 * @throws {Error}
 * @returns {Promise<void>}
 */
async function unzip(zippedFile, cacheDir) {
  const zip = await yauzl.open(zippedFile);
  let entry = await zip.readEntry();
  /* Array to hold symbolic link entries */
  const symlinks = [];

  while (entry !== null) {
    const entryPathAbs = resolveWithin(cacheDir, entry.filename);
    /* Check if entry is a symbolic link */
    const isSymlink = (modeFromEntry(entry) & 0o170000) === 0o120000;

    if (isSymlink) {
      /* Store symlink entries to process later */
      symlinks.push(entry);
    } else {
      /* Handle regular files and directories */
      await fs.promises.mkdir(path.dirname(entryPathAbs), { recursive: true });
      /* Skip directories */
      if (!entry.filename.endsWith("/")) {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(entryPathAbs);
        await stream.promises.pipeline(readStream, writeStream);

        /* Set file permissions after the file has been written */
        const mode = modeFromEntry(entry);
        await fs.promises.chmod(entryPathAbs, mode);
      }
    }

    /* Read next entry */
    entry = await zip.readEntry();
  }

  /* Process symbolic links after all other files have been extracted */
  for (const symlinkEntry of symlinks) {
    const entryPathAbs = resolveWithin(cacheDir, symlinkEntry.filename);
    const readStream = await symlinkEntry.openReadStream();
    /** @type {Buffer[]} */
    const chunks = [];
    readStream.on("data", (chunk) => chunks.push(chunk));
    await new Promise((resolve, reject) => {
      readStream.on("end", resolve);
      readStream.on("error", reject);
    });
    const linkTarget = Buffer.concat(chunks).toString("utf8").trim();

    /*
     * The link target comes out of the archive too, so a contained symlink can
     * still point anywhere - and a later entry written through it escapes.
     * Resolve the target relative to the link's own directory and require it
     * to stay inside cacheDir as well.
     */
    resolveWithin(
      cacheDir,
      path.relative(
        cacheDir,
        path.resolve(path.dirname(entryPathAbs), linkTarget),
      ),
    );

    /* Check if the symlink or a file/directory already exists at the destination */
    if (fs.existsSync(entryPathAbs)) {
      /* skip */
    } else {
      /* Create symbolic link */
      await fs.promises.symlink(linkTarget, entryPathAbs);
    }
  }
  await zip.close();
}
