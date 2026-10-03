import crypto from "node:crypto";
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

/**
 * Name of the update info file `@nwutils/updater` downloads to find the
 * latest release, following electron-builder's naming: `x64` gets the bare
 * `latest-linux.yml`, every other architecture gets an `-<arch>` suffix.
 * @param {"ia32" | "x64" | "arm64"} arch
 * @returns {string}
 */
function updateInfoFileName(arch) {
  return arch === "x64" ? "latest-linux.yml" : `latest-linux-${arch}.yml`;
}

/**
 * Serialise `value` as a YAML scalar. Strings are written double-quoted via
 * `JSON.stringify` - a JSON string literal is also a valid YAML double-quoted
 * scalar, so this never needs YAML-specific escaping rules.
 * @param {string | number | boolean} value
 * @returns {string}
 */
function stringifyYamlScalar(value) {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

/**
 * Serialise a map of scalars, and lists of maps of scalars, as YAML. This is
 * the only shape the update info and `app-update.yml` files use, so it avoids
 * pulling in a YAML library for a handful of lines.
 * @param {Record<string, string | number | boolean | Record<string, string | number | boolean>[] | undefined>} entries
 * @returns {string}
 */
function stringifyYaml(entries) {
  let fileContent = "";
  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      fileContent += `${key}:\n`;
      for (const item of value) {
        let prefix = "  - ";
        for (const [itemKey, itemValue] of Object.entries(item)) {
          fileContent += `${prefix}${itemKey}: ${stringifyYamlScalar(itemValue)}\n`;
          prefix = "    ";
        }
      }
    } else {
      fileContent += `${key}: ${stringifyYamlScalar(value)}\n`;
    }
  }
  return fileContent;
}

/**
 * Compute the base64 encoded SHA-512 digest of the file at `filePath`, the
 * same encoding electron-builder writes into its update info files.
 * @async
 * @function
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function sha512(filePath) {
  const hash = crypto.createHash("sha512");
  for await (const chunk of fs.createReadStream(filePath)) {
    hash.update(chunk);
  }
  return hash.digest("base64");
}

export default {
  APPIMAGE_ARCH_KV,
  fileExists,
  parseDesktopEntry,
  sha512,
  stringifyDesktopEntry,
  stringifyYaml,
  updateInfoFileName,
};
