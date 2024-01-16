import console from "node:console";
import {promises} from "node:fs";
import https from "node:https";
import {resolve, basename} from "node:path";
import { arch, platform } from "node:process";

import * as GlobModule from "glob";

/**
 * Get manifest (array of NW release metadata) from URL
 *
 * @param  {string}                       manifestUrl  Url to manifest
 * @return {Promise <object | undefined>}
 */
function getManifest(manifestUrl) {
  let chunks = undefined;

  return new Promise((resolve) => {
    const req = https.get(manifestUrl, (response) => {
      response.on("data", (chunk) => {
        chunks += chunk;
      });

      response.on("error", (e) => {
        console.error(e);
        resolve(undefined);
      });

      response.on("end", () => {
        resolve(chunks);
      });
    });
    req.on("error", (e) => {
      console.error(e);
      resolve(undefined);
    });
  });
}

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} platform     NW platform
 * @param  {string} arch         NW architecture
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */
async function getReleaseInfo(
  version,
  platform,
  arch,
  cacheDir,
  manifestUrl,
) {
  let releaseData = undefined;
  let manifestPath = undefined;
  if (platform === "osx" && arch === "arm64") {
    manifestPath = resolve(cacheDir, "manifest.mac.arm.json");
  } else {
    manifestPath = resolve(cacheDir, "manifest.json");
  }

  try {
    const data = await getManifest(manifestUrl);
    if (data !== undefined) {
      await promises.writeFile(manifestPath, data.slice(9));
    }

    let manifest = JSON.parse(await promises.readFile(manifestPath));
    if (version === "latest" || version === "stable" || version === "lts") {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`,
    );
  } catch (e) {
    console.error(
      "The version manifest does not exist/was not downloaded. Please try again in some time.",
    );
  }
  return releaseData;
}

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

const EXE_NAME = {
  win: "nw.exe",
  osx: "nwjs.app/Contents/MacOS/nwjs",
  linux: "nw",
};

/**
 * Replaces the ffmpeg file in the nwjs directory with the one provided
 *
 * @param {string} platform  The platform to replace the ffmpeg file for
 * @param {string} nwDir     The directory of the nwjs installation
 */
const replaceFfmpeg = async (platform, nwDir) => {
  let ffmpegFile;
  if (platform === "linux") {
    ffmpegFile = "libffmpeg.so";
  } else if (platform === "win") {
    ffmpegFile = "ffmpeg.dll";
  } else if (platform === "osx") {
    ffmpegFile = "libffmpeg.dylib";
  }
  const src = resolve(nwDir, ffmpegFile);
  if (platform === "linux") {
    const dest = resolve(nwDir, "lib", ffmpegFile);
    await promises.copyFile(src, dest);
  } else if (platform === "win") {
    // don't do anything for windows because the extracted file is already in the correct path
    // await copyFile(src, path.resolve(nwDir, ffmpegFile));
  } else if (platform === "osx") {
    let dest = resolve(
      nwDir,
      "nwjs.app",
      "Contents",
      "Frameworks",
      "nwjs Framework.framework",
      "Versions",
      "Current",
      ffmpegFile,
    );

    try {
      await promises.copyFile(src, dest);
    } catch (e) {
      //some versions of node/macOS complain about destination being a file, and others complain when it is only a directory.
      //the only thing I can think to do is to try both
      dest = resolve(
        nwDir,
        "nwjs.app",
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
      );
      await promises.copyFile(src, dest);
    }
  }
};

async function globFiles({
  srcDir,
  glob,
}) {
  let files;
  if (glob) {
    files = [];
    const patterns = srcDir.split(" ");
    for (const pattern of patterns) {
      let filePath = await GlobModule.glob(pattern);
      files.push(...filePath);
    }
  } else {
    files = srcDir;
  }
  return files;
}

async function getNodeManifest({
  srcDir, glob
}) {
  let manifest;
  let files;
  if (glob) {
    files = await globFiles({srcDir, glob});
    for (const file of files) {
      if (basename(file) === "package.json" && manifest === undefined) {
        manifest = JSON.parse(await promises.readFile(file));
      }
    }
  } else {
    manifest = JSON.parse(await promises.readFile(resolve(srcDir, "package.json")));
  }

  if (manifest === undefined) {
    throw new Error("package.json not found in srcDir file glob patterns.");
  }

  return manifest;
}

/**
 * Parse options
 *
 * @param  {import("../../index.js").Options} options  Options
 * @param  {object}                           pkg      Package.json as JSON
 * @return {Promise<object>}                           Options
 */
export const parse = async (options, pkg) => {
  options = options ?? {};
  options.mode = options.mode ?? "build";

  options.version = options.version ?? "latest";
  options.flavor = options.flavor ?? "normal";
  options.platform = options.platform ?? PLATFORM_KV[platform];
  options.arch = options.arch ?? ARCH_KV[arch];
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.cacheDir = options.cacheDir ?? "./cache";
  options.cache = options.cache ?? true;
  options.ffmpeg = options.ffmpeg ?? false;
  options.logLevel = options.logLevel ?? "info";

  if (options.mode === "get") {
    return { ...options };
  }

  options.argv = options.argv ?? [];
  options.glob = options.glob ?? true;
  options.srcDir = options.srcDir ?? (options.glob ? "./*" : ".");

  if (options.mode === "run") {
    return { ...options };
  }

  options.outDir = resolve(options.outDir ?? "./out");
  options.zip = options.zip ?? false;

  options.managedManifest = options.managedManifest ?? false;
  options.nativeAddon = options.nativeAddon ?? false;

  options.app = options.app ?? {};
  options.app.name = options.app.name ?? pkg.name;
  options.app.icon = options.app.icon ?? undefined;

  // TODO(#737): move this out
  if (options.platform === "linux") {
    // linux desktop entry file configurations options
    options.app.genericName = options.app.genericName ?? undefined;
    options.app.noDisplay = options.app.noDisplay ?? undefined;
    options.app.comment = options.app.comment ?? undefined;
    options.app.hidden = options.app.hidden ?? undefined;
    options.app.onlyShowIn = options.app.onlyShowIn ?? undefined;
    options.app.notShowIn = options.app.notShowIn ?? undefined;
    options.app.dBusActivatable = options.app.dBusActivatable ?? undefined;
    options.app.tryExec = options.app.tryExec ?? undefined;
    options.app.exec = options.app.name ?? undefined;
    options.app.path = options.app.path ?? undefined;
    options.app.terminal = options.app.terminal ?? undefined;
    options.app.actions = options.app.actions ?? undefined;
    options.app.mimeType = options.app.mimeType ?? undefined;
    options.app.categories = options.app.categories ?? undefined;
    options.app.implements = options.app.implements ?? undefined;
    options.app.keywords = options.app.keywords ?? undefined;
    options.app.startupNotify = options.app.startupNotify ?? undefined;
    options.app.startupWMClass = options.app.startupWMClass ?? undefined;
    options.app.prefersNonDefaultGPU =
      options.app.prefersNonDefaultGPU ?? undefined;
    options.app.singleMainWindow = options.app.singleMainWindow ?? undefined;
  }
  if (options.platform === "win") {
    // windows configuration options
    options.app.version = options.app.version ?? pkg.version;
    options.app.comments = options.app.comments ?? undefined;
    options.app.company = options.app.company ?? pkg.author;
    options.app.fileDescription =
      options.app.fileDescription ?? pkg.description;
    options.app.fileVersion = options.app.fileVersion ?? pkg.version;
    options.app.internalName = options.app.internalName ?? pkg.name;
    options.app.legalCopyright = options.app.legalCopyright ?? undefined;
    options.app.legalTrademark = options.app.legalTrademark ?? undefined;
    options.app.originalFilename = options.app.originalFilename ?? pkg.name;
    options.app.privateBuild = options.app.privateBuild ?? undefined;
    options.app.productName = options.app.productName ?? pkg.name;
    options.app.productVersion = options.app.productVersion ?? pkg.version;
    options.app.specialBuild = options.app.specialBuild ?? undefined;
  }

  if (options.platform === "osx") {
    options.app.LSApplicationCategoryType =
      options.app.LSApplicationCategoryType ?? undefined;
    options.app.CFBundleIdentifier =
      options.app.CFBundleIdentifier ?? options.app.name;
    options.app.CFBundleName = options.app.CFBundleName ?? pkg.name;
    options.app.CFBundleDisplayName =
      options.app.CFBundleDisplayName ?? pkg.name;
    options.app.CFBundleSpokenName = options.app.CFBundleSpokenName ?? pkg.name;
    options.app.CFBundleShortVersionString =
      options.app.CFBundleVersion ?? pkg.version;
    options.app.CFBundleVersion =
      options.app.CFBundleShortVersionString ?? pkg.version;
    options.app.NSHumanReadableCopyright =
      options.app.NSHumanReadableCopyright ?? undefined;
  }

  return { ...options };
};

/**
 * Validate options
 *
 * @param  {import("../index.js").Options} options      Options
 * @param  {object}                        releaseInfo  Version specific NW release info
 * @return {Promise<undefined>}                         Return undefined if options are valid
 * @throws {Error}                                         Throw error if options are invalid
 */
export const validate = async (options, releaseInfo) => {
  if (!["get", "run", "build"].includes(options.mode)) {
    throw new Error(
      `Unknown mode ${options.mode}. Expected "get", "run" or "build".`,
    );
  }
  if (typeof releaseInfo === "undefined") {
    throw new Error(
      "Either the specific version info does not exist or the version manifest itself does not exist. In case of the latter, please check your internet connection and try again later.",
    );
  }
  if (!releaseInfo.flavors.includes(options.flavor)) {
    throw new Error(
      `${options.flavor} flavor is not supported by this download server.`,
    );
  }
  if (
    options.platform &&
    options.arch &&
    !releaseInfo.files.includes(`${options.platform}-${options.arch}`)
  ) {
    throw new Error(
      `Platform ${options.platform} and architecture ${options.arch} is not supported by this download server.`,
    );
  }
  // if (typeof options.cacheDir !== "string") {
  //   throw new Error("Expected options.cacheDir to be a string. Got " + typeof options.cacheDir);
  // }
  if (typeof options.cache !== "boolean") {
    return new Error(
      "Expected options.cache to be a boolean. Got " + typeof options.cache,
    );
  }
  if (typeof options.ffmpeg !== "boolean") {
    return new Error(
      "Expected options.ffmpeg to be a boolean. Got " + typeof options.ffmpeg,
    );
  }

  if (
    options.logLevel !== "error" &&
    options.logLevel !== "warn" &&
    options.logLevel !== "info" &&
    options.logLevel !== "debug"
  ) {
    throw new Error(
      "Expected options.logLevel to be 'error', 'warn', 'info' or 'debug'. Got " +
      options.logLevel,
    );
  }

  if (options.mode === "get") {
    return undefined;
  }
  if (Array.isArray(options.argv)) {
    return new Error(
      "Expected options.argv to be an array. Got " + typeof options.argv,
    );
  }
  if (typeof options.glob !== "boolean") {
    return new Error(
      "Expected options.glob to be a boolean. Got " + typeof options.glob,
    );
  }

  if (options.srcDir) {
    await promises.readdir(options.srcDir);
  }

  if (options.mode === "run") {
    return undefined;
  }

  if (options.outDir) {
    await promises.readdir(options.outDir);
  }

  if (
    typeof options.managedManifest !== "boolean" &&
    typeof options.managedManifest !== "object" &&
    typeof options.managedManifest !== "string"
  ) {
    return new Error(
      "Expected options.managedManifest to be a boolean, object or string. Got " +
      typeof options.managedManifest,
    );
  }

  if (typeof options.managedManifest === "object") {
    if (options.managedManifest.name === undefined) {
      return new Error("Expected NW.js Manifest to have a `name` property.");
    }
    if (options.managedManifest.main === undefined) {
      return new Error("Expected NW.js Manifest to have a `main` property.");
    }
  }

  if (typeof options.nativeAddon !== "boolean") {
    if (typeof options.nativeAddon !== "boolean" && typeof options.nativeAddon !== "string") {
      return new Error("Expected options.nativeAddon to be a boolean or string type. Got " + typeof options.nativeAddon);
    }

    if (semver.parse(options.version).minor >= "83" && options.nativeAddon !== false) {
      return new Error("Native addons are not supported for NW.js v0.82.0 and below");
    }
  }

  // TODO: Validate app options
  return undefined;
};

/**
 *
 * @param {"chromedriver"} type
 * @param {object} options
 * @throws {Error}
 * @return {string}
 */
async function getPath(type, options) {
  if (type === "chromedriver") {
    return resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform
      }-${options.arch}`,
      `chromedriver${options.platform === "win" ? ".exe" : ""}`,
    );
  } else {
    throw new Error("Invalid type. Expected `chromedriver` but got ", type);
  }
}

export default { getReleaseInfo, getPath, PLATFORM_KV, ARCH_KV, EXE_NAME, replaceFfmpeg, globFiles, getNodeManifest, parse, validate };
