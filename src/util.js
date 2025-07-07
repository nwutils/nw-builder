import console from 'node:console';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import process from 'node:process';

import * as GlobModule from 'glob';
import semver from 'semver';

/**
 * Get manifest (array of NW release metadata) from URL.
 * @param  {string}                      manifestUrl  Url to manifest
 * @returns {Promise<string>}              - Manifest object
 */
function getManifest(manifestUrl) {
  let chunks = '';

  return new Promise((resolve) => {
    const req = https.get(manifestUrl, (response) => {
      response.on('data', (chunk) => {
        chunks += chunk;
      });

      response.on('error', (e) => {
        console.error(e);
        resolve('');
      });

      response.on('end', () => {
        resolve(chunks);
      });
    });
    req.on('error', (e) => {
      console.error(e);
      resolve('');
    });
  });
}

/**
 * Get version specific release metadata.
 * @param  {string} version      NW version
 * @param  {string} platform     NW platform
 * @param  {string} arch         NW architecture
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @returns {object}              Version specific release info
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
  if (platform === 'osx' && arch === 'arm64') {
    manifestPath = path.resolve(cacheDir, 'manifest.mac.arm.json');
  } else {
    manifestPath = path.resolve(cacheDir, 'manifest.json');
  }

  try {
    const data = await getManifest(manifestUrl);
    if (data.length) {
      await fs.promises.writeFile(manifestPath, data);
    }

    const manifest = JSON.parse(await fs.promises.readFile(manifestPath));
    if (version === 'latest' || version === 'stable' || version === 'lts') {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`,
    );
  } catch {
    console.error(
      'The version manifest does not exist/was not downloaded. Please try again in some time.',
    );
  }
  return releaseData;
}

const PLATFORM_KV = {
  darwin: 'osx',
  linux: 'linux',
  win32: 'win',
};

const ARCH_KV = {
  x64: 'x64',
  ia32: 'ia32',
  arm64: 'arm64',
};

const EXE_NAME = {
  win: 'nw.exe',
  osx: 'nwjs.app/Contents/MacOS/nwjs',
  linux: 'nw',
};

/**
 * Glob files.
 * @async
 * @function
 * @param  {object}            options         - glob file options
 * @param  {string | string[]} options.srcDir  - app src dir
 * @param  {boolean}           options.glob    - glob flag
 * @returns {Promise<string[]>}                 - Returns array of file paths
 */
async function globFiles({
  srcDir,
  glob,
}) {
  let files;
  let patterns;
  if (glob) {
    files = [];
    patterns = [];
    if (Array.isArray(srcDir)) {
      patterns = srcDir;
    } else {
      patterns = srcDir.split(' ');
    }

    for (const pattern of patterns) {
      let filePath = await GlobModule.glob(pattern);
      files.push(...filePath);
    }
  } else {
    files = srcDir;
  }
  return files;
}

/**
 * Get Node manifest.
 * @async
 * @function
 * @param  {object}             options         - node manifest options
 * @param  {string | string []} options.srcDir  - src dir
 * @param  {boolean}            options.glob    - glob flag
 * @returns {Promise.<{path: string, json: object}>}      - Node manifest
 */
async function getNodeManifest({
  srcDir, glob
}) {
  let manifest = {
    path: '',
    json: undefined,
  };
  let files;
  if (glob === true) {
    files = await globFiles({ srcDir, glob });
    for (const file of files) {
      if (path.basename(file) === 'package.json' && manifest.json === undefined) {
        manifest.path = file;
        manifest.json = JSON.parse(await fs.promises.readFile(file));
      }
    }
  } else {
    manifest.path = path.resolve(srcDir, 'package.json');
    manifest.json = JSON.parse(await fs.promises.readFile(path.resolve(srcDir, 'package.json')));
  }

  if (manifest.json === undefined) {
    throw new Error('package.json not found in srcDir file glob patterns.');
  }

  return manifest;
}

/**
 * Function to convert `'true'` and `'false'` into `true` and `false`.
 * `commander` does not do the conversion automatically.
 * @param {any} option - a boolean type option
 * @returns {any} Usually `undefined`, `true` or `false`. if not then it is validated later on.
 */
function str2Bool(option) {
  if (typeof option === 'string') {
    if (option === 'true') {
      return true;
    } else if (option === 'false') {
      return false;
    }
  } else {
    return option;
  }
}

/**
 * Parse options.
 * @param  {import("../../index.js").Options} options  Options
 * @param  {object}                           pkg      Package.json as JSON
 * @returns {Promise<object>}                           Options
 */
export const parse = async (options, pkg) => {
  options = options ?? {};
  options.mode = options.mode ?? 'build';

  options.version = options.version ?? 'latest';
  options.flavor = options.flavor ?? 'normal';
  options.platform = options.platform ?? PLATFORM_KV[process.platform];
  options.arch = options.arch ?? ARCH_KV[process.arch];
  options.downloadUrl = options.downloadUrl ?? 'https://dl.nwjs.io';
  options.manifestUrl = options.manifestUrl ?? 'https://nwjs.io/versions.json';
  options.cacheDir = options.cacheDir ?? './cache';
  options.cache = str2Bool(options.cache ?? true);
  options.ffmpeg = str2Bool(options.ffmpeg ?? false);
  options.logLevel = options.logLevel ?? 'info';
  options.shaSum = options.shaSum ?? true;

  if (options.mode === 'get') {
    return { ...options };
  }

  options.argv = options.argv ?? [];
  options.glob = str2Bool(options.glob) ?? true;
  options.srcDir = options.srcDir ?? (options.glob ? './*' : '.');

  if (options.mode === 'run') {
    return { ...options };
  }

  options.outDir = path.resolve(options.outDir ?? './out');
  options.zip = str2Bool(options.zip) ?? false;

  options.managedManifest = str2Bool(options.managedManifest) ?? false;
  options.nativeAddon = str2Bool(options.nativeAddon) ?? false;

  options.app = options.app ?? {};
  options.app.name = options.app.name ?? pkg.name;
  /* Since the `parse` function is called twice, the first time `pkg` is `{}` and `options.app.name` is `undefined`. */
  if (options.app.name) {
    /* Remove special and control characters from app.name to mitigate potential path traversal. */
    options.app.name = options.app.name.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '');
  }
  /* Path to where the icon currently is in the filesystem */
  options.app.icon = options.app.icon ?? pkg.window?.icon ?? undefined;
  if (options.app.icon) {
    options.app.icon = path.resolve(options.app.icon);
  }

  // TODO(#737): move this out
  if (options.platform === 'linux') {
    // linux desktop entry file configurations options
    options.app.genericName = options.app.genericName ?? undefined;
    options.app.noDisplay = options.app.noDisplay ?? undefined;
    options.app.comment = options.app.comment ?? undefined;
    options.app.hidden = options.app.hidden ?? undefined;
    options.app.onlyShowIn = options.app.onlyShowIn ?? undefined;
    options.app.notShowIn = options.app.notShowIn ?? undefined;
    options.app.dBusActivatable = options.app.dBusActivatable ?? undefined;
    options.app.tryExec = options.app.tryExec ?? undefined;
    options.app.exec = options.app.exec ?? undefined;
    if (options.app.exec) {
      options.app.exec = path.resolve(options.app.exec);
    }
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
  if (options.platform === 'win') {
    // windows configuration options
    options.app.version = options.app.version ?? pkg.version;
    options.app.comments = options.app.comments ?? undefined;
    options.app.company = options.app.company ?? pkg.author;
    options.app.fileDescription =
      options.app.fileDescription ?? pkg.description;
    options.app.fileVersion = options.app.fileVersion ?? options.app.version ?? pkg.version;
    options.app.internalName = options.app.internalName ?? pkg.name;
    options.app.legalCopyright = options.app.legalCopyright ?? undefined;
    options.app.legalTrademark = options.app.legalTrademark ?? undefined;
    options.app.originalFilename = options.app.originalFilename ?? options.app.name;
    options.app.privateBuild = options.app.privateBuild ?? undefined;
    options.app.productName = options.app.productName ?? pkg.name;
    options.app.productVersion = options.app.productVersion ?? pkg.version;
    options.app.specialBuild = options.app.specialBuild ?? undefined;
    options.app.languageCode = options.app.languageCode ?? 1033;
  }

  if (options.platform === 'osx') {
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
    options.app.NSLocalNetworkUsageDescription =
      options.app.NSLocalNetworkUsageDescription ?? undefined;
  }

  return { ...options };
};

/**
 * Validate options.
 * @param  {import("../index.js").Options} options      Options
 * @param  {object}                        releaseInfo  Version specific NW release info
 * @returns {Promise<undefined>}                         Return undefined if options are valid
 * @throws {Error}                                         Throw error if options are invalid
 */
export const validate = async (options, releaseInfo) => {
  if (
    options.mode !== 'get' &&
    options.mode !== 'run' &&
    options.mode !== 'build'
  ) {
    throw new Error(
      `Unknown mode ${options.mode}. Expected "get", "run" or "build".`,
    );
  }
  if (typeof releaseInfo === 'undefined') {
    throw new Error(
      'Either the specific version info does not exist or the version manifest itself does not exist. In case of the latter, please check your internet connection and try again later.',
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
  if (typeof options.downloadUrl === 'string' && !options.downloadUrl.startsWith('http') && !options.downloadUrl.startsWith('file')) {
    throw new Error('Expected options.downloadUrl to be a string and starts with `http` or `file`.');
  }
  if (typeof options.manifestUrl === 'string' && !options.manifestUrl.startsWith('http') && !options.manifestUrl.startsWith('file')) {
    throw new Error('Expected options.manifestUrl to be a string and starts with `http` or `file`.');
  }
  if (typeof options.cacheDir !== 'string') {
    throw new Error('Expected options.cacheDir to be a string. Got ' + typeof options.cacheDir);
  }

  if (typeof options.cache !== 'boolean') {
    throw new Error(
      'Expected options.cache to be a boolean. Got ' + typeof options.cache,
    );
  }
  if (typeof options.ffmpeg !== 'boolean') {
    throw new Error(
      'Expected options.ffmpeg to be a boolean. Got ' + typeof options.ffmpeg,
    );
  }

  if (
    options.logLevel !== 'error' &&
    options.logLevel !== 'warn' &&
    options.logLevel !== 'info' &&
    options.logLevel !== 'debug'
  ) {
    throw new Error(
      'Expected options.logLevel to be \'error\', \'warn\', \'info\' or \'debug\'. Got ' +
      options.logLevel,
    );
  }

  if (typeof options.shaSum !== 'boolean') {
    throw new Error(
      'Expected options.shaSum to be a boolean. Got ' + typeof options.shaSum,
    );
  }

  if (options.mode === 'get') {
    return undefined;
  }
  if (typeof options.srcDir !== 'string' && !Array.isArray(options.srcDir)) {
    throw new Error('Expected options.srcDir to be a string or Array<string>. Got ' + typeof options.srcDir);
  }
  if (!Array.isArray(options.argv)) {
    throw new Error(
      'Expected options.argv to be an array. Got ' + typeof options.argv,
    );
  }
  if (typeof options.glob !== 'boolean') {
    throw new Error(
      'Expected options.glob to be a boolean. Got ' + typeof options.glob,
    );
  }

  if (options.mode === 'run') {
    return undefined;
  }

  if (typeof options.outDir !== 'string') {
    throw new Error('Expected options.outDir to be a string. Got ' + typeof options.outDir);
  }

  if (
    typeof options.managedManifest !== 'boolean' &&
    typeof options.managedManifest !== 'object' &&
    typeof options.managedManifest !== 'string'
  ) {
    throw new Error(
      'Expected options.managedManifest to be a boolean, object or string. Got ' +
      typeof options.managedManifest,
    );
  }

  if (typeof options.managedManifest === 'object') {
    if (options.managedManifest.name === undefined) {
      throw new Error('Expected NW.js Manifest to have a `name` property.');
    }
    if (options.managedManifest.main === undefined) {
      throw new Error('Expected NW.js Manifest to have a `main` property.');
    }
  }

  if (typeof options.nativeAddon !== 'boolean') {
    if (typeof options.nativeAddon !== 'boolean' && typeof options.nativeAddon !== 'string') {
      throw new Error('Expected options.nativeAddon to be a boolean or string type. Got ' + typeof options.nativeAddon);
    }

    if (semver.parse(options.version).minor >= '83' && options.nativeAddon !== false) {
      throw new Error('Native addons are not supported for NW.js v0.82.0 and below');
    }

    if (typeof options.zip !== 'boolean' &
      options.zip !== 'zip' &&
      options.zip !== 'tar' &&
      options.zip !== 'tgz') {
      throw new Error('Expected options.zip to be a boolean, `zip`, `tar` or `tgz`. Got ' + typeof options.zip);
    }
  }

  if (options.platform === 'linux') {
    if (options.app.name && typeof options.app.name !== 'string') {
      throw new Error('Expected options.app.name to be a string. Got ' + options.app.name);
    }
    if (options.app.genericName && typeof options.app.genericName !== 'string') {
      throw new Error('Expected options.app.genericName to be a string. Got ' + options.app.genericName);
    }
    if (options.app.noDisplay && typeof options.app.noDisplay !== 'boolean') {
      throw new Error('Expected options.app.noDisplay to be a boolean. Got ' + options.app.noDisplay);
    }
    if (options.app.comment && typeof options.app.comment !== 'string') {
      throw new Error('Expected options.app.comment to be a string. Got ' + options.app.comment);
    }
    if (options.app.icon && typeof options.app.icon !== 'string') {
      throw new Error('Expected options.app.icon to be a string. Got ' + options.app.icon);
    }
    if (options.app.hidden && typeof options.app.hidden !== 'string') {
      throw new Error('Expected options.app.hidden to be a string. Got ' + options.app.hidden);
    }
    if (options.app.onlyShowIn && !Array.isArray(options.app.onlyShowIn)) {
      throw new Error('Expected options.app.onlyShowIn to be an Array<string>. Got ' + options.app.onlyShowIn);
    }
    if (options.app.notShowIn && !Array.isArray(options.app.notShowIn)) {
      throw new Error('Expected options.app.notShowIn to be an Array<string>. Got ' + options.app.notShowIn);
    }
    if (options.app.dBusActivatable && typeof options.app.dBusActivatable !== 'boolean') {
      throw new Error('Expected options.app.dBusActivatable to be a boolean. Got ' + options.app.dBusActivatable);
    }
    if (options.app.tryExec && typeof options.app.tryExec !== 'string') {
      throw new Error('Expected options.app.tryExec to be a string. Got ' + options.app.tryExec);
    }
    if (options.app.exec && typeof options.app.exec !== 'string') {
      throw new Error('Expected options.app.exec to be a string. Got ' + options.app.exec);
    }
    if (options.app.path && typeof options.app.path !== 'string') {
      throw new Error('Expected options.app.path to be a string. Got ' + options.app.path);
    }
    if (options.app.terminal && typeof options.app.terminal !== 'boolean') {
      throw new Error('Expected options.app.terminal to be a boolean. Got ' + options.app.terminal);
    }
    if (options.app.actions && !Array.isArray(options.app.actions)) {
      throw new Error('Expected options.app.actions to be a Array<string>. Got ' + options.app.actions);
    }
    if (options.app.mimeType && !Array.isArray(options.app.mimeType)) {
      throw new Error('Expected options.app.mimeType to be a Array<string>. Got ' + options.app.mimeType);
    }
    if (options.app.categories && !Array.isArray(options.app.categories)) {
      throw new Error('Expected options.app.categories to be a Array<string>. Got ' + options.app.categories);
    }
    if (options.app.implements && !Array.isArray(options.app.implements)) {
      throw new Error('Expected options.app.implements to be a Array<string>. Got ' + options.app.implements);
    }
    if (options.app.keywords && !Array.isArray(options.app.keywords)) {
      throw new Error('Expected options.app.keywords to be a Array<string>. Got ' + options.app.keywords);
    }
    if (options.app.startupNotify && typeof options.app.startupNotify !== 'boolean') {
      throw new Error('Expected options.app.startupNotify to be a boolean. Got ' + options.app.startupNotify);
    }
    if (options.app.startupWMClass && typeof options.app.startupWMClass !== 'string') {
      throw new Error('Expected options.app.startupWMClass to be a string. Got ' + options.app.startupWMClass);
    }
    if (options.app.prefersNonDefaultGPU && typeof options.app.prefersNonDefaultGPU !== 'boolean') {
      throw new Error('Expected options.app.prefersNonDefaultGPU to be a boolean. Got ' + options.app.prefersNonDefaultGPU);
    }
    if (options.app.singleMainWindow && typeof options.app.singleMainWindow !== 'string') {
      throw new Error('Expected options.app.singleMainWindow to be a string. Got ' + options.app.singleMainWindow);
    }
  } else if (options.platform === 'osx') {
    if (typeof options.app.name !== 'string') {
      throw new Error('Expected options.app.name to be a string. Got ' + options.app.name);
    }
    if (typeof options.app.icon !== 'string') {
      throw new Error('Expected options.app.icon to be a string. Got ' + options.app.icon);
    }
    if (typeof options.app.LSApplicationCategoryType !== 'string') {
      throw new Error('Expected options.app.LSApplicationCategoryType to be a string. Got ' + options.app.LSApplicationCategoryType);
    }
    if (typeof options.app.CFBundleIdentifier !== 'string') {
      throw new Error('Expected options.app.CFBundleIdentifier to be a string. Got ' + options.app.CFBundleIdentifier);
    }
    if (typeof options.app.CFBundleName !== 'string') {
      throw new Error('Expected options.app.CFBundleName to be a string. Got ' + options.app.CFBundleName);
    }
    if (typeof options.app.CFBundleDisplayName !== 'string') {
      throw new Error('Expected options.app.CFBundleDisplayName to be a string. Got ' + options.app.CFBundleDisplayName);
    }
    if (typeof options.app.CFBundleSpokenName !== 'string') {
      throw new Error('Expected options.app.CFBundleSpokenName to be a string. Got ' + options.app.CFBundleSpokenName);
    }
    if (typeof options.app.CFBundleVersion !== 'string') {
      throw new Error('Expected options.app.CFBundleVersion to be a string. Got ' + options.app.CFBundleVersion);
    }
    if (typeof options.app.CFBundleShortVersionString !== 'string') {
      throw new Error('Expected options.app.CFBundleShortVersionString to be a string. Got ' + options.app.CFBundleShortVersionString);
    }
    if (typeof options.app.NSHumanReadableCopyright !== 'string') {
      throw new Error('Expected options.app.NSHumanReadableCopyright to be a string. Got ' + options.app.NSHumanReadableCopyright);
    }
    if (typeof options.app.NSLocalNetworkUsageDescription !== 'string') {
      throw new Error('Expected options.app.NSLocalNetworkUsageDescription to be a string. Got ' + options.app.NSLocalNetworkUsageDescription);
    }
  } else {
    if (typeof options.app.name !== 'string') {
      throw new Error('Expected options.app.name to be a string. Got ' + options.app.name);
    }
    if (typeof options.app.icon !== 'string') {
      throw new Error('Expected options.app.icon to be a string. Got ' + options.app.icon);
    }
    if (typeof options.app.version !== 'string') {
      throw new Error('Expected options.app.version to be a string. Got ' + options.app.version);
    }
    if (options.app.comments && typeof options.app.comments !== 'string') {
      throw new Error('Expected options.app.comments to be a string. Got ' + options.app.comments);
    }
    if (options.app.company && typeof options.app.company !== 'string') {
      throw new Error('Expected options.app.company to be a string. Got ' + options.app.company);
    }
    if (options.app.fileDescription && typeof options.app.fileDescription !== 'string') {
      throw new Error('Expected options.app.fileDescription to be a string. Got ' + options.app.fileDescription);
    }
    if (options.app.fileVersion && typeof options.app.fileVersion !== 'string') {
      throw new Error('Expected options.app.fileVersion to be a string. Got ' + options.app.fileVersion);
    }
    if (options.app.internalName && typeof options.app.internalName !== 'string') {
      throw new Error('Expected options.app.internalName to be a string. Got ' + options.app.internalName);
    }
    if (options.app.legalCopyright && options.app.legalCopyright && typeof options.app.legalCopyright !== 'string') {
      throw new Error('Expected options.app.legalCopyright to be a string. Got ' + options.app.legalCopyright);
    }
    if (options.app.legalTrademark && typeof options.app.legalTrademark !== 'string') {
      throw new Error('Expected options.app.legalTrademark to be a string. Got ' + options.app.legalTrademark);
    }
    if (options.app.originalFilename && typeof options.app.originalFilename !== 'string') {
      throw new Error('Expected options.app.originalFilename to be a string. Got ' + options.app.originalFilename);
    }
    if (options.app.privateBuild && typeof options.app.privateBuild !== 'string') {
      throw new Error('Expected options.app.privateBuild to be a string. Got ' + options.app.privateBuild);
    }
    if (options.app.productName && typeof options.app.productName !== 'string') {
      throw new Error('Expected options.app.productName to be a string. Got ' + options.app.productName);
    }
    if (options.app.productVersion && typeof options.app.productVersion !== 'string') {
      throw new Error('Expected options.app.productVersion to be a string. Got ' + options.app.productVersion);
    }
    if (options.app.specialBuild && options.app.specialBuild && typeof options.app.specialBuild !== 'string') {
      throw new Error('Expected options.app.specialBuild to be a string. Got ' + options.app.specialBuild);
    }
    if (options.app.legalCopyright && typeof options.app.legalCopyright !== 'string') {
      throw new Error('Expected options.app.legalCopyright to be a string. Got ' + options.app.legalCopyright);
    }
    if (typeof options.app.languageCode !== 'number') {
      throw new Error('Expected options.app.languageCode to be a number. Got ' + options.app.languageCode);
    }
  }
  return undefined;
};

/**
 * Get path to various NW specific file paths.
 * @async
 * @function
 * @param  {"chromedriver"} type     - NW specific file or directory
 * @param  {object}         options  - nwbuild options
 * @returns {string}                  - Path to chromedriver
 * @throws {Error}
 */
async function getPath(type, options) {
  if (type === 'chromedriver') {
    return path.resolve(
      options.cacheDir,
      `nwjs${options.flavor === 'sdk' ? '-sdk' : ''}-v${options.version}-${options.platform
      }-${options.arch}`,
      `chromedriver${options.platform === 'win' ? '.exe' : ''}`,
    );
  } else {
    throw new Error('Invalid type. Expected `chromedriver` but got ', type);
  }
}

/**
 * Check if file exists at specified path.
 * @param  {string}           filePath  - File path to check existence of
 * @returns {Promise<boolean>}           `true` if exists, otherwise `false`
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
 * Custom logging function
 * @param {'debug' | 'info' | 'warn' | 'error'} severity - severity of message
 * @param {'debug' | 'info' | 'warn' | 'error'} logLevel - log level requested by user
 * @param {string} message - contents of message
 * @throws {Error} - throw error on invalid input
 * @returns {string} - stdout
 */
function log(severity, logLevel, message) {
  if (!['debug', 'info', 'warn', 'error'].includes(severity)) {
    throw new Error(`Expected debug, info, warn or error message severity. Got ${severity}`);
  }
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
    throw new Error(`Expected debug, info, warn or error user defined log level. Got ${logLevel}`);
  }

  const sev = {
    'debug': 4,
    'info': 3,
    'warn': 2,
    'error': 1,
  };
  let stdout = '';
  const messageSeverity = sev[severity];
  const userDefSeverity = sev[logLevel];

  if (messageSeverity <= userDefSeverity) {
    stdout = `[ ${severity.toUpperCase()} ] ${message}`;
  }

  console.log(stdout);

  return stdout;
}

export default { fileExists, getReleaseInfo, getPath, PLATFORM_KV, ARCH_KV, EXE_NAME, globFiles, getNodeManifest, parse, validate, log };
