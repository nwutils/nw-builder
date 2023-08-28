import { readdir, readFile, writeFile } from "node:fs/promises";
import { get } from "node:https";
import { resolve } from "node:path";
import process from "node:process";

import detectCurrentPlatform from "./utilities/detectCurrentPlatform.js";
import { log } from "./log.js";

/**
 * Get manifest (array of NW release metadata) from URL
 *
 * @param  {string}                       manifestUrl  Url to manifest
 * @return {Promise <object | undefined>}
 */
function getManifest(manifestUrl) {
  let chunks = undefined;

  return new Promise((resolve) => {
    const req = get(manifestUrl, (res) => {
      res.on("data", (chunk) => {
        chunks += chunk;
      });

      res.on("error", (e) => {
        log.error(e);
        resolve(undefined);
      });

      res.on("end", () => {
        log.debug("Succesfully cached manifest metadata");
        resolve(chunks);
      });
    });
    req.on("error", (e) => {
      log.warn(e);
      resolve(undefined);
    });
  });
}

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */
export async function getReleaseInfo(version, cacheDir, manifestUrl) {
  let releaseData = undefined;
  let manifestPath = undefined;
  manifestPath = resolve(cacheDir, "manifest.json");

  try {
    const data = await getManifest(manifestUrl);
    if (data !== undefined) {
      await writeFile(manifestPath, data.slice(9));
    }

    let manifest = JSON.parse(await readFile(manifestPath));
    if (version === "latest" || version === "stable" || version === "lts") {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`,
    );
  } catch (e) {
    log.debug(
      "The version manifest does not exist/was not downloaded. Please try again in some time.",
    );
  }
  return releaseData;
}

export const PLATFORM_KV = {
  darwin: "osx",
  linux: "linux",
  win32: "win",
};

export const ARCH_KV = {
  x64: "x64",
  ia32: "ia32",
  arm64: "arm64",
};

export const EXE_NAME = {
  win: "nw.exe",
  osx: "nwjs.app/Contents/MacOS/nwjs",
  linux: "nw",
};

/**
 * Check if NW binaries are cached
 *
 * @param  {string}           cacheDir  Path to cached NW binaries
 * @return {Promise<boolean>}           Boolean value to denote if cache exists or not
 */
export async function isCached(cacheDir) {
  let exists = true;
  try {
    await readdir(cacheDir);
  } catch (e) {
    exists = false;
  }
  return exists;
}

/**
 *
 * @param options
 * @param pkg
 */
export function parse(options, pkg) {
  options = options || {};
  options.files = options.files ?? null;
  options.version = options.version ?? "latest";
  options.flavor = options.flavor ?? "sdk";
  options.currentPlatform = detectCurrentPlatform(process);
  options.platforms = options.platforms ?? [options.currentPlatform];

  if (options.platforms.length === 1) {
    options.platforms = options.platforms[0].split(",");
  }

  if (options.platforms.includes("linux")) {
    options.platforms.push("linux32", "linux64");
    let idx = options.platforms.indexOf("linux");
    options.platforms.splice(idx, 1);
  } else if (options.platforms.includes("osx")) {
    options.platforms.push("osx64");
    let idx = options.platforms.indexOf("osx");
    options.platforms.splice(idx, 1);
  } else if (options.platforms.includes("win")) {
    options.platforms.push("win32", "win64");
    let idx = options.platforms.indexOf("win");
    options.platforms.splice(idx, 1);
  }

  options.appName = options.appName ?? false;

  if (options.appName === false && pkg !== undefined) {
    options.appName = pkg.name;
  }

  options.appVersion = options.appVersion ?? false;

  if (options.appVersion === false && pkg !== undefined) {
    options.appVersion = pkg.version;
  }

  options.buildType = options.buildType ?? "default";

  if (options.buildType === "default") {
    // Don't do anything. options.appName is already set.
  } else if (options.buildType === "versioned") {
    options.appName = options.appName + " - v" + options.appVersion;
  } else if (options.buildType === "timestamped") {
    options.appName =
      options.appName + " - " + Math.round(Date.now() / 1000).toString();
  }

  options.buildDir = options.buildDir ?? "./build";
  options.cacheDir = options.cacheDir ?? "./cache";
  options.forceDownload = options.forceDownload ?? false;
  options.argv = options.argv ?? [];

  options.macCredits = options.macCredits ?? false;
  options.macIcns = options.macIcns ?? false;
  options.zip = options.zip ?? null;
  options.zipOptions = options.zipOptions ?? null;
  options.macPlist = options.macPlist ?? false;
  options.winVersionString = options.winVersionString ?? {};
  options.winIco = options.winIco ?? null;
  options.macZip = options.macZip ?? null;
  options.mergeZip = options.mergeZip ?? true;
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.quiet = options.quiet ?? "info";

  return options;
}

/**
 *
 * @param options
 * @param releaseInfo
 */
export async function validate(options, releaseInfo) {
  if (typeof releaseInfo === "undefined") {
    throw new Error(
      "Either the specific version info does not exist or the version manifest itself does not exist. In case of the latter, please check your internet connection and try again later.",
    );
  }

  if (
    typeof options.files !== "string" &&
    !Array.isArray(options.files) &&
    options.files !== null
  ) {
    throw new Error(
      "Expected options.files to be a string, array or null. Got " +
        typeof options.files,
    );
  }

  if (!releaseInfo.flavors.includes(options.flavor)) {
    throw new Error(
      `${options.flavor} flavor is not supported by this download server.`,
    );
  }
  for (let platform of options.platforms) {
    let plat = platform.slice(0, platform.length - 2);
    let arch = "x" + platform.slice(platform.length - 2);
    if (!releaseInfo.files.includes(`${plat}-${arch}`)) {
      throw new Error(
        `$${plat}-${arch} is not supported by this download server.`,
      );
    }
  }

  if (typeof options.appName !== "string") {
    throw new Error(
      "Expected options.appName to be a string. Got " + typeof options.appName,
    );
  }

  if (typeof options.appVersion !== "string") {
    throw new Error(
      "Expected options.appVersion to be a string. Got " +
        typeof options.appVersion,
    );
  }

  if (!["default", "versioned", "timestamped"].includes(options.buildType)) {
    throw new Error(
      "Expected 'default', 'versioned' or 'timestamped'. Got " +
        options.buildType,
    );
  }

  if (options.buildDir) {
    await readdir(options.buildDir);
  }

  if (options.cacheDir) {
    await readdir(options.cacheDir);
  }

  if (typeof options.forceDownload !== "boolean") {
    return new Error(
      "Expected options.forceDownload to be a boolean. Got " +
        typeof options.cache,
    );
  }

  if (Array.isArray(options.argv)) {
    return new Error(
      "Expected options.argv to be an array. Got " + typeof options.argv,
    );
  }

  if (
    ["error", "warn", "info", "debug", "off"].includes(options.quiet) === false
  ) {
    {
      throw new Error(
        "Expected 'error', 'warn', 'info', 'debug' or 'off'. Got " +
          options.quiet,
      );
    }
  }
}
