import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pipeline } from "node:stream/promises";

import * as GlobModule from "glob";
import ZipStream from "zip-stream";

const PLATFORM_KV = {
  darwin: "osx",
  linux: "linux",
  win32: "win",
};

const ARCH_KV = {
  x64: "x64",
  ia32: "ia32",
  arm64: "arm64",
};

/**
 * Glob files.
 * @async
 * @function
 * @param  {object}            options         - glob file options
 * @param  {string | string[]} options.srcDir  - app src dir
 * @param  {boolean}           options.glob    - glob flag
 * @returns {Promise<string[] | string>}        - Returns array of file paths, or `srcDir` as-is when `glob` is false
 */
async function globFiles({ srcDir, glob }) {
  let files;
  let patterns;
  if (glob) {
    files = [];
    if (Array.isArray(srcDir)) {
      patterns = srcDir;
    } else {
      patterns = srcDir.split(" ");
    }

    const include = patterns.filter((p) => !p.startsWith("!"));
    const ignore = patterns
      .filter((p) => p.startsWith("!"))
      .map((p) => p.substring(1));
    let filePath = await GlobModule.glob(include, { ignore });
    files.push(...filePath);
  } else {
    files = srcDir;
  }
  return files;
}

/**
 * Recursively list a directory without following symlinks. A directory is
 * yielded before its contents, and entries are sorted so output is stable.
 * @param  {string} absDir  - directory to walk
 * @param  {string} relDir  - path of `absDir` relative to the walk root, using `/`
 * @returns {AsyncGenerator<{ absolute: string, relative: string, stats: fs.Stats }>}
 */
async function* walkDirectory(absDir, relDir) {
  const names = (await fs.promises.readdir(absDir)).sort();
  for (const name of names) {
    const absolute = path.join(absDir, name);
    const relative = relDir === "" ? name : `${relDir}/${name}`;
    const stats = await fs.promises.lstat(absolute);
    yield { absolute, relative, stats };
    if (stats.isDirectory()) {
      yield* walkDirectory(absolute, relative);
    }
  }
}

/**
 * Zip the contents of a directory, so its children sit at the archive root.
 *
 * Matches what `archiver`'s `directory(srcDir, false)` produced: directories
 * get their own entries, symlinks are stored as symlinks (relative to the
 * link's directory) instead of being followed, and each entry keeps its
 * permission bits and mtime. Other file types (sockets, FIFOs) are skipped.
 * @async
 * @function
 * @param  {string} srcDir    - directory to compress
 * @param  {string} destFile  - path of the zip file to write
 * @returns {Promise<void>}   - resolves once the zip file is fully written
 */
async function zipDirectory(srcDir, destFile) {
  const isWin = process.platform === "win32";
  const archive = new ZipStream();
  const written = pipeline(archive, fs.createWriteStream(destFile));

  /**
   * @param {Buffer | fs.ReadStream} source
   * @param {import("zip-stream").FileDataInput} data
   * @returns {Promise<void>}
   */
  const addEntry = (source, data) =>
    new Promise((resolve, reject) => {
      archive.entry(source, data, (error) =>
        error ? reject(error) : resolve(),
      );
    });

  try {
    for await (const { absolute, relative, stats } of walkDirectory(
      srcDir,
      "",
    )) {
      const date = stats.mtime;
      let mode = stats.mode & (isWin ? 0o777 : 0o7777);
      if (stats.isFile()) {
        await addEntry(fs.createReadStream(absolute), {
          name: relative,
          type: "file",
          date,
          mode,
        });
      } else if (stats.isDirectory()) {
        // stat is unreliable for directories on Windows
        if (isWin) mode = 0o755;
        await addEntry(Buffer.alloc(0), {
          name: `${relative}/`,
          type: "directory",
          date,
          mode,
        });
      } else if (stats.isSymbolicLink()) {
        const linkDir = path.dirname(absolute);
        const target = await fs.promises.readlink(absolute);
        const linkname = path
          .relative(linkDir, path.resolve(linkDir, target))
          .replace(/\\/g, "/");
        await addEntry(Buffer.alloc(0), {
          name: relative,
          type: "symlink",
          linkname,
          date,
          mode,
        });
      }
    }
    archive.finalize();
  } catch (error) {
    archive.destroy(/** @type {Error} */ (error));
  }
  await written;
}

/**
 * Copy globbed files into the NW.js project directory.
 *
 * In glob mode the current working directory is the app root: each file keeps
 * its path relative to `cwd`, so `package.json src/**` produces
 * `package.json` and `src/...` at the top of `destDir`. Absolute matches
 * inside `cwd` are placed the same way.
 *
 * A match outside `cwd` (for example from `../app/**`) has no place in that
 * layout, so this rejects before copying anything instead of writing files
 * next to, or outside, `destDir`.
 * @async
 * @function
 * @param  {string[]} files    - paths returned by `globFiles`
 * @param  {string}   destDir  - NW.js project directory (`package.nw` / `app.nw`)
 * @param  {string}   [cwd]    - app root the files are relative to
 * @returns {Promise<void>}
 */
async function copyGlobFiles(files, destDir, cwd = process.cwd()) {
  /** @type {{ src: string, dest: string }[]} */
  const copies = [];
  /** @type {string[]} */
  const outside = [];
  for (const file of files) {
    const src = path.resolve(cwd, file);
    const relative = path.relative(cwd, src);
    // ".." or "../x" escapes cwd; an absolute result means another drive on Windows.
    if (
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      outside.push(file);
      continue;
    }
    copies.push({ src, dest: path.join(destDir, relative) });
  }

  if (outside.length > 0) {
    const shown = outside.slice(0, 5).join(", ");
    const more = outside.length > 5 ? ` and ${outside.length - 5} more` : "";
    throw new Error(
      `srcDir glob matched files outside the current working directory (${cwd}): ${shown}${more}. ` +
        "With glob enabled, paths are kept relative to the current working directory, which becomes the app root, " +
        "so these files have no place in the build. Run nwbuild from the app directory, " +
        'or set glob to false and srcDir to the app directory (for example srcDir: "../app").',
    );
  }

  for (const { src, dest } of copies) {
    const stats = await fs.promises.stat(src);
    if (stats.isDirectory()) {
      continue;
    }
    await fs.promises.cp(src, dest, {
      recursive: true,
      force: true,
    });
  }
}

export default {
  PLATFORM_KV,
  ARCH_KV,
  globFiles,
  zipDirectory,
  copyGlobFiles,
};
