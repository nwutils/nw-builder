import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

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
    const value = entries[key];
    if (value !== undefined) {
      /* A line break would let the key or value inject further entries, eg. a second `Exec`. */
      if (/[\r\n]/.test(key) || /[\r\n]/.test(value)) {
        throw new Error(
          `Desktop entry keys and values must not contain line breaks. Received: ${JSON.stringify(`${key}=${value}`)}`,
        );
      }
      fileContent += `${key}=${value}\n`;
    }
  }
  return fileContent;
}

/**
 * Quote `value` as a single POSIX shell word. Inside single quotes nothing is
 * expanded, so only single quotes themselves need escaping.
 * @param {string} value
 * @returns {string}
 */
function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

/**
 * Quote `value` as a single argument of a desktop entry's `Exec` key, per the
 * Desktop Entry Specification: `%` is doubled so it isn't read as a field
 * code, an argument with reserved characters is double quoted with `"`, `` ` ``,
 * `$` and `\` backslash-escaped, and finally backslashes are escaped again as
 * required for every string value.
 * @param {string} value
 * @returns {string}
 */
function desktopExecArg(value) {
  let arg = value.replaceAll("%", "%%");
  if (/[\s"'\\><~|&;$*?#()`]/.test(arg)) {
    arg = `"${arg.replace(/["`$\\]/g, "\\$&")}"`;
  }
  return arg.replaceAll("\\", "\\\\");
}

/**
 * Name of the update info file `@nwutils/updater` downloads for `arch` on
 * `platform`, gets the bare
 * `latest-linux.yml` (Linux), `latest.yml` (Windows) or `latest-mac.yml`
 * (MacOS), every other architecture gets an `-<arch>` suffix.
 * @param {string}                  arch
 * @param {"linux" | "win" | "osx"} [platform="linux"]
 * @returns {string}
 */
function updateInfoFileName(arch, platform = "linux") {
  const base =
    platform === "win"
      ? "latest"
      : platform === "osx"
        ? "latest-mac"
        : "latest-linux";
  return arch === "x64" ? `${base}.yml` : `${base}-${arch}.yml`;
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
 * Compute the base64 encoded SHA-512 digest of the file at `filePath`.
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

/**
 * Escape `value` for use inside a double quoted NSIS string. NSIS expands `$`
 * variables and `$\` escapes there, so `$` is doubled and `"` is escaped.
 * Line breaks are rejected rather than escaped: a raw one would end the
 * command and let the value inject further script lines. The result is not
 * quoted, so it can be joined with NSIS variables, eg. `"$INSTDIR\<value>"`.
 * @param {string} value
 * @returns {string}
 */
function nsisEscape(value) {
  if (/[\r\n]/.test(value)) {
    throw new Error(
      `NSIS strings must not contain line breaks. Received: ${JSON.stringify(value)}`,
    );
  }
  /* In a replacement string `$$` is a literal `$`, so "$$$$" writes "$$". */
  return value.replaceAll("$", "$$$$").replaceAll('"', '$\\"');
}

/**
 * Check a path on the host for use inside a double quoted NSIS string that
 * `makensis` reads at compile time, eg. a `File` source or `OutFile`. Unlike
 * runtime strings, those keep `$` literally, so nothing is escaped. Instead,
 * the sequences `makensis` would still interpret are rejected: `${define}`
 * expansions and `$\` escapes, and `"` - an escaped `$\"` doesn't survive
 * being passed through a `!define`, as the icon and license paths are.
 * @param {string} value
 * @returns {string}  `value`, unchanged.
 */
function nsisPath(value) {
  if (/[\r\n"]/.test(value) || value.includes("${") || value.includes("$\\")) {
    throw new Error(
      `Paths passed to NSIS must not contain line breaks, '"', "\${" or "$\\". Received: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

/**
 * Names Windows reserves for devices, with or without an extension.
 * @type {RegExp}
 */
const WINDOWS_RESERVED_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

/**
 * Check that `value` can be used as a single Windows file name: no path
 * separators, characters Windows forbids in file names, control characters,
 * trailing dots or spaces, or reserved device names.
 * @param {string} value
 * @returns {boolean}
 */
function isWindowsFileName(value) {
  const hasControlCharacter = [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });
  return (
    value !== "" &&
    /[<>:"/\\|?*]/.test(value) === false &&
    hasControlCharacter === false &&
    /[. ]$/.test(value) === false &&
    WINDOWS_RESERVED_NAME.test(value) === false
  );
}

/**
 * Convert a version such as `"1.2.3"` or `"1.2.3-beta.1"` into the
 * `X.X.X.X` form Windows version resources (and NSIS' `VIProductVersion`)
 * require. Up to four leading numeric parts are kept, missing ones are
 * filled with `0`, and any prerelease or build suffix is dropped.
 * @param {string} version
 * @returns {string}
 */
function windowsVersion(version) {
  const match = version.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?/);
  if (match === null) {
    throw new Error(
      `Expected a version starting with a number, eg. "1.2.3". Received: ${JSON.stringify(version)}`,
    );
  }
  const parts = match.slice(1).map((part) => Number(part ?? 0));
  if (parts.some((part) => part > 65535)) {
    throw new Error(
      `Expected each part of the version to be at most 65535. Received: ${JSON.stringify(version)}`,
    );
  }
  return parts.join(".");
}

/**
 * Throw if `publish` isn't a valid `PublishOptions` object.
 * @param {unknown} publish
 * @returns {void}
 */
function validatePublish(publish) {
  if (typeof publish !== "object" || publish === null) {
    throw new Error(
      `Expected "options.publish" to be an object. Received: ${JSON.stringify(publish)}`,
    );
  }

  const { provider } = /** @type {{provider?: unknown}} */ (publish);
  /** @type {string[]} */
  let requiredKeys;
  if (provider === "github") {
    requiredKeys = ["owner", "repo"];
  } else if (provider === "generic") {
    requiredKeys = ["url"];
  } else {
    throw new Error(
      `Expected "options.publish.provider" to be "github" or "generic". Received: ${JSON.stringify(provider)}`,
    );
  }

  for (const key of requiredKeys) {
    const value = /** @type {Record<string, unknown>} */ (publish)[key];
    if (typeof value !== "string" || value === "") {
      throw new Error(
        `Expected "options.publish.${key}" to be a non-empty string for provider "${provider}". Received: ${JSON.stringify(value)}`,
      );
    }
  }

  if (provider === "github") {
    /*
     * The characters GitHub allows in owner and repository names. Anything
     * else - eg. "|", the update information's field separator - is rejected.
     */
    for (const key of requiredKeys) {
      const value = /** @type {Record<string, string>} */ (publish)[key];
      if (/^[A-Za-z0-9._-]+$/.test(value) === false) {
        throw new Error(
          `Expected "options.publish.${key}" to be a GitHub ${key} name (letters, digits, ".", "-" and "_"). Received: ${JSON.stringify(value)}`,
        );
      }
    }
  }

  if (provider === "generic") {
    const { url } =
      /** @type {import("./appImage.js").GenericPublishOptions} */ (publish);
    let protocol;
    try {
      protocol = new URL(url).protocol;
    } catch {
      protocol = undefined;
    }
    if (protocol !== "https:" && protocol !== "http:") {
      throw new Error(
        `Expected "options.publish.url" to be an http(s) URL. Received: ${JSON.stringify(url)}`,
      );
    }
  }
}

/**
 * Contents of the `app-update.yml` file `@nwutils/updater` reads to find out
 * where releases are published. It is shipped next to the NW.js executable.
 * @param {import("./appImage.js").PublishOptions} publish
 * @returns {string}
 */
function appUpdateYaml(publish) {
  return stringifyYaml(
    publish.provider === "github"
      ? { provider: publish.provider, owner: publish.owner, repo: publish.repo }
      : { provider: publish.provider, url: publish.url },
  );
}

/**
 * Write the update info file `@nwutils/updater` compares the running version
 * against, describing the packaged artifact at `filePath`. It must be uploaded
 * to every release next to the artifact.
 * @async
 * @function
 * @param  {object}  options
 * @param  {string}  options.filePath        Path to the packaged artifact, eg. the AppImage or installer.
 * @param  {string}  options.updateInfoPath  Path the update info file is written to.
 * @param  {string}  options.version         Version of the application.
 * @returns {Promise<void>}
 */
async function writeUpdateInfo({ filePath, updateInfoPath, version }) {
  const fileName = path.basename(filePath);
  const sha512Digest = await sha512(filePath);
  const { size } = await fs.promises.stat(filePath);
  await fs.promises.writeFile(
    updateInfoPath,
    stringifyYaml({
      version,
      files: [{ url: fileName, sha512: sha512Digest, size }],
      path: fileName,
      sha512: sha512Digest,
      releaseDate: new Date().toISOString(),
    }),
  );
}

export default {
  APPIMAGE_ARCH_KV,
  appUpdateYaml,
  desktopExecArg,
  fileExists,
  isWindowsFileName,
  nsisEscape,
  nsisPath,
  parseDesktopEntry,
  sha512,
  shellQuote,
  stringifyDesktopEntry,
  stringifyYaml,
  updateInfoFileName,
  validatePublish,
  windowsVersion,
  writeUpdateInfo,
};
