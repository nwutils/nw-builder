import fs from "node:fs";
import path from "node:path";
import stream from "node:stream";

import * as tar from "tar";
import yauzl from "yauzl-promise";

/**
 * Maximum number of entries an archive may contain, and maximum total bytes
 * an archive may extract to `cacheDir` across all entries combined. Guards
 * against decompression bombs (CWE-409) - a small, highly compressed archive
 * that expands to an implausible amount of data or number of files on disk.
 * @type {number}
 */
const MAX_ENTRIES = 200_000;

/**
 * @type {number}
 */
const MAX_TOTAL_EXTRACTED_SIZE = 20 * 1024 * 1024 * 1024; // 20 GiB

/**
 * Maximum size of a single symlink target read from a zip archive. Real
 * filesystem paths are nowhere near this size; a "symlink" entry claiming
 * more is either corrupt or an attempt to exhaust memory by buffering an
 * unbounded amount of "target" data.
 * @type {number}
 */
const MAX_SYMLINK_TARGET_SIZE = 4096;

/**
 * Decompresses a file at `filePath` to `cacheDir` directory.
 * @async
 * @function
 * @param {string} filePath                          - file path to compressed binary
 * @param {string} cacheDir                          - directory to decompress into
 * @param {object} [limits]                          - override the default bomb-protection limits (CWE-409). Exposed for tests; production callers should not need this.
 * @param {number} [limits.maxEntries]                - defaults to {@link MAX_ENTRIES}
 * @param {number} [limits.maxTotalExtractedSize]     - defaults to {@link MAX_TOTAL_EXTRACTED_SIZE}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export default async function decompress(filePath, cacheDir, limits = {}) {
  const maxEntries = limits.maxEntries ?? MAX_ENTRIES;
  const maxTotalExtractedSize =
    limits.maxTotalExtractedSize ?? MAX_TOTAL_EXTRACTED_SIZE;

  if (filePath.endsWith(".zip")) {
    /*
     * Every entry unzip() writes is resolved through resolveWithin() first -
     * file entries, symlink names and symlink targets alike. The rule reports
     * the call site rather than the write site, so it cannot see that guard
     * from here.
     */
    // eslint-disable-next-line node-security/no-zip-slip
    await unzip(filePath, cacheDir, maxEntries, maxTotalExtractedSize);
  } else {
    /*
     * node-tar v7 strips `..` segments and absolute paths itself unless
     * `preservePaths` is set, and it is not set here.
     */
    let tarEntryCount = 0;
    let tarExtractedBytes = 0;

    /*
     * `filter` below tracks `tarExtractedBytes` against
     * `maxTotalExtractedSize` and skips any entry that would exceed it, so
     * this is bounded even though the linter can't see through the closure.
     */
    // eslint-disable-next-line node-security/no-zip-slip, secure-coding/no-unlimited-resource-allocation
    await tar.extract({
      file: filePath,
      C: cacheDir,
      /* Bomb protection (CWE-409): skip entries once either limit is hit. */
      filter: (entryPath, entry) => {
        tarEntryCount += 1;
        if (tarEntryCount > maxEntries) {
          console.warn(
            `Skipping ${JSON.stringify(entryPath)}: archive entry count exceeds the limit of ${maxEntries}.`,
          );
          return false;
        }

        tarExtractedBytes += entry.size ?? 0;
        if (tarExtractedBytes > maxTotalExtractedSize) {
          console.warn(
            `Skipping ${JSON.stringify(entryPath)}: total extracted size would exceed the limit of ${maxTotalExtractedSize} bytes.`,
          );
          return false;
        }

        return true;
      },
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
 * @param  {string}        zippedFile             - file path to .zip file
 * @param  {string}        cacheDir               - directory to unzip in
 * @param  {number}        maxEntries             - bomb protection (CWE-409): max archive entries
 * @param  {number}        maxTotalExtractedSize  - bomb protection (CWE-409): max total bytes extracted
 * @throws {Error}
 * @returns {Promise<void>}
 */
async function unzip(zippedFile, cacheDir, maxEntries, maxTotalExtractedSize) {
  const zip = await yauzl.open(zippedFile);

  try {
    let entry = await zip.readEntry();
    /* Array to hold symbolic link entries */
    const symlinks = [];
    /* Bomb protection (CWE-409) state, shared across every entry. */
    let entryCount = 0;
    let totalExtractedBytes = 0;

    while (entry !== null) {
      entryCount += 1;
      if (entryCount > maxEntries) {
        throw new Error(
          `Refusing to extract archive: entry count exceeds the limit of ${maxEntries}.`,
        );
      }

      const entryPathAbs = resolveWithin(cacheDir, entry.filename);
      /* Check if entry is a symbolic link */
      const isSymlink = (modeFromEntry(entry) & 0o170000) === 0o120000;

      if (isSymlink) {
        /* Store symlink entries to process later */
        symlinks.push(entry);
      } else {
        /* Handle regular files and directories */
        await fs.promises.mkdir(path.dirname(entryPathAbs), {
          recursive: true,
        });
        /* Skip directories */
        if (!entry.filename.endsWith("/")) {
          const readStream = await entry.openReadStream();
          const writeStream = fs.createWriteStream(entryPathAbs);
          /* Track actual bytes streamed rather than trusting the archive's declared size. */
          const sizeGuard = new stream.Transform({
            transform(chunk, _encoding, callback) {
              totalExtractedBytes += chunk.length;
              if (totalExtractedBytes > maxTotalExtractedSize) {
                callback(
                  new Error(
                    `Refusing to extract archive: total extracted size exceeds the limit of ${maxTotalExtractedSize} bytes.`,
                  ),
                );
                return;
              }
              callback(null, chunk);
            },
          });
          await stream.promises.pipeline(readStream, sizeGuard, writeStream);

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
      let symlinkTargetSize = 0;
      await new Promise((resolve, reject) => {
        readStream.on("data", (chunk) => {
          symlinkTargetSize += chunk.length;
          if (symlinkTargetSize > MAX_SYMLINK_TARGET_SIZE) {
            readStream.destroy();
            reject(
              new Error(
                `Refusing to extract ${JSON.stringify(symlinkEntry.filename)}: symlink target exceeds ${MAX_SYMLINK_TARGET_SIZE} bytes.`,
              ),
            );
            return;
          }
          chunks.push(chunk);
        });
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
  } finally {
    await zip.close();
  }
}
