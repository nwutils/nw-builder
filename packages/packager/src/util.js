import fs from "node:fs";

/**
 * Map nw-builder's architecture identifiers to the identifiers used in
 * `appimagetool` release asset names and its `ARCH` environment variable.
 * @type {Record<"ia32" | "x64" | "arm64", string>}
 */
const APPIMAGE_ARCH_KV = {
  ia32: "i686",
  x64: "x86_64",
  arm64: "aarch64",
};

/**
 * Check if a file or directory exists.
 * @async
 * @function
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  let exists = true;
  try {
    await fs.promises.stat(filePath);
  } catch {
    exists = false;
  }
  return exists;
}

/**
 * Parse a freedesktop.org desktop entry file's `[Desktop Entry]` group into
 * a key/value map. Other groups (eg. `[Desktop Action ...]`) are ignored.
 * @param {string} contents
 * @returns {Record<string, string>}
 */
function parseDesktopEntry(contents) {
  /** @type {Record<string, string>} */
  const entries = {};
  let inDesktopEntryGroup = false;

  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }
    if (line.startsWith("[")) {
      inDesktopEntryGroup = line === "[Desktop Entry]";
      continue;
    }
    if (inDesktopEntryGroup === false) {
      continue;
    }
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    entries[key] = value;
  }

  return entries;
}

/**
 * Serialise a `[Desktop Entry]` key/value map back into a desktop entry file.
 * @param {Record<string, string | undefined>} entries
 * @returns {string}
 */
function stringifyDesktopEntry(entries) {
  let fileContent = "[Desktop Entry]\n";
  for (const key of Object.keys(entries)) {
    if (entries[key] !== undefined) {
      fileContent += `${key}=${entries[key]}\n`;
    }
  }
  return fileContent;
}

export default {
  APPIMAGE_ARCH_KV,
  fileExists,
  parseDesktopEntry,
  stringifyDesktopEntry,
};
