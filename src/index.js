import child_process from 'node:child_process';
import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';

import bld from './bld.js';
import get from './get/index.js';
import run from './run.js';
import util from './util.js';

/**
 * @typedef {object} Options Configuration options
 * @property {"get" | "run" | "build"}             [mode="build"]                            Choose between get, run or build mode
 * @property {"latest" | "stable" | string}        [version="latest"]                        Runtime version
 * @property {"normal" | "sdk"}                    [flavor="normal"]                         Runtime flavor
 * @property {"linux" | "osx" | "win"}             platform                                  Host platform
 * @property {"ia32" | "x64" | "arm64"}            arch                                      Host architecture
 * @property {"https://dl.nwjs.io" | string}       [downloadUrl="https://dl.nwjs.io"]        Download server
 * @property {"https://nwjs.io/versions.json" | string} [manifestUrl="https://nwjs.io/versions.json"]  Versions manifest
 * @property {"./cache" | string}                  [cacheDir="./cache"]                      Directory to cache NW binaries
 * @property {"./" | string}                       [srcDir="./"]                             File paths to application code
 * @property {"./out" | string}                    [outDir="./out"]                          Directory to store build artifacts
 * @property {object}                              app                                       Refer to Linux/Windows Specific Options under Getting Started in the docs
 * @property {boolean}                             [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean}                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
 * @property {boolean}                             [glob=true]                               If true file globbing is enabled when parsing srcDir.
 * @property {"error" | "warn" | "info" | "debug"} [logLevel="info"]                         Specify level of logging.
 * @property {boolean}                             [shaSum = true]                           If true, shasum is enabled. Otherwise, disabled.
 * @property {boolean | "zip" | "tar" | "tgz"}     [zip=false]                               If true, "zip", "tar" or "tgz" the outDir directory is compressed.
 * @property {boolean | string | object}           [managedManifest = false]                 Managed manifest mode
 * @property {false | "gyp"}                       [nodeAddon = false]                       Rebuild Node native addons
 * @property {boolean}                             [cli=false]                               If true the CLI is used to parse options. This option is used internally.
 */

/**
 * Main module exported.
 * @async
 * @function
 * @param  {Options}       options  Options
 * @returns {Promise<child_process.ChildProcess | null | undefined>} - Returns NW.js process if run mode, otherwise returns `undefined`.
 */
async function nwbuild(options) {
  let built;
  let releaseInfo = {};
  let manifest = {
    path: '',
    json: undefined,
  };

  try {
    /* Parse options */
    options = await util.parse(options, manifest);
    util.log('debug', 'info', 'Parse initial options');

    util.log('debug', 'info', 'Get node manifest...');
    manifest = await util.getNodeManifest({ srcDir: options.srcDir, glob: options.glob });
    if (typeof manifest.json?.nwbuild === 'object') {
      options = manifest.json.nwbuild;
    }

    util.log('info', options.logLevel, 'Parse final options using node manifest');
    options = await util.parse(options, manifest.json);
    util.log('debug', options.logLevel, 'Manifest: ', `${manifest.path}\n${manifest.json}\n`);

    built = fs.existsSync(options.cacheDir);
    if (built === false) {
      await fs.promises.mkdir(options.cacheDir, { recursive: true });
    }

    if (options.mode === 'build') {
      built = fs.existsSync(options.outDir);
      if (built === false) {
        await fs.promises.mkdir(options.outDir, { recursive: true });
      }
    }

    /* Validate options.version to get the version specific release info */
    util.log('info', options.logLevel, 'Get version specific release info...');
    releaseInfo = await util.getReleaseInfo(
      options.version,
      options.platform,
      options.arch,
      options.cacheDir,
      options.manifestUrl,
    );
    util.log('debug', options.logLevel, `Release info:\n${JSON.stringify(releaseInfo, null, 2)}\n`);

    util.log('info', options.logLevel, 'Validate options.* ...');
    await util.validate(options, releaseInfo);
    util.log('debug', options.logLevel, `Options:\n${JSON.stringify(options, null, 2)}`);

    /* Remove leading "v" from version string */
    options.version = releaseInfo.version.slice(1);

    util.log('info', options.logLevel, 'Getting NW.js and related binaries...');
    await get({
      version: options.version,
      flavor: options.flavor,
      platform: options.platform,
      arch: options.arch,
      downloadUrl: options.downloadUrl,
      cacheDir: options.cacheDir,
      cache: options.cache,
      ffmpeg: options.ffmpeg,
      nativeAddon: options.nativeAddon,
      shaSum: options.shaSum,
      logLevel: options.logLevel,
    });

    if (options.mode === 'get') {
      // Do nothing else since we have already downloaded the binaries.
      return undefined;
    }

    if (options.mode === 'run') {
      util.log('info', options.logLevel, 'Running NW.js in run mode...');
      const nwProcess = await run({
        version: options.version,
        flavor: options.flavor,
        platform: options.platform,
        arch: options.arch,
        srcDir: options.srcDir,
        cacheDir: options.cacheDir,
        glob: options.glob,
        argv: options.argv,
      });
      return nwProcess;
    } else if (options.mode === 'build') {
      util.log('info', options.logLevel, `Build a NW.js application for ${options.platform} ${options.arch}...`);
      await bld({
        version: options.version,
        flavor: options.flavor,
        platform: options.platform,
        arch: options.arch,
        manifestUrl: options.manifestUrl,
        srcDir: options.srcDir,
        cacheDir: options.cacheDir,
        outDir: options.outDir,
        app: options.app,
        glob: options.glob,
        managedManifest: options.managedManifest,
        nativeAddon: options.nativeAddon,
        zip: options.zip,
        releaseInfo: releaseInfo,
      });
      util.log('info', options.logLevel, `Appliction is available at ${path.resolve(options.outDir)}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return undefined;
}

export default nwbuild;
