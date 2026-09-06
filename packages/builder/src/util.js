import * as GlobModule from "glob";

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

export default {
  PLATFORM_KV,
  ARCH_KV,
  globFiles,
};
