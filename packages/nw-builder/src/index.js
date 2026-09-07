import child_process from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";

import bld from "@nwutils/builder";
import get from "@nwutils/getter";
import { packageApp } from "@nwutils/packager";
import run from "@nwutils/runner";

import util from "./util.js";

/**
 * @typedef {object} Options Configuration options
 * @property {"get" | "run" | "build" | "package"} [mode="build"]                            Choose between get, run, build or package mode
 * @property {"latest" | "stable" | string}        [version="latest"]                        Runtime version
 * @property {"normal" | "sdk"}                    [flavor="normal"]                         Runtime flavor
 * @property {"linux" | "osx" | "win"}             [platform]                                Host platform
 * @property {"ia32" | "x64" | "arm64"}            [arch]                                    Host architecture
 * @property {"https://dl.nwjs.io" | string}       [downloadUrl="https://dl.nwjs.io"]        Download server
 * @property {"https://nwjs.io/versions.json" | string} [manifestUrl="https://nwjs.io/versions.json"] Versions manifest URI, https or file path
 * @property {"./cache" | string}                  [cacheDir="./cache"]                      Directory to cache NW binaries
 * @property {string | string[]}                   [srcDir="./"]                             File paths to application code
 * @property {"./out" | string}                    [outDir="./out"]                          Directory to store build artifacts
 * @property {object}                              [app]                                     Refer to Linux/Windows Specific Options under Getting Started in the docs
 * @property {boolean}                             [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean}                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
 * @property {boolean}                             [glob=true]                               If true file globbing is enabled when parsing srcDir.
 * @property {"error" | "warn" | "info" | "debug"} [logLevel="info"]                         Specify level of logging.
 * @property {boolean}                             [shaSum = true]                           If true, shasum is enabled. Otherwise, disabled.
 * @property {boolean | "zip" | "tar" | "tgz"}     [zip=false]                               If true, "zip", "tar" or "tgz" the outDir directory is compressed.
 * @property {boolean | string | object}           [managedManifest = false]                 Managed manifest mode
 * @property {boolean}                             [nativeAddon = false]                     Get Node native addons
 * @property {boolean}                             [cli=false]                               If true the CLI is used to parse options. This option is used internally.
 * @property {string[]}                            [argv = []]                               CLI arguments passed to the NW.js process in run mode
 * @property {"AppImage" | "deb" | "rpm" | "MSIX" | "NSIS"} [format]                          Packaged output format, used in package mode. Defaults to `"AppImage"` on Linux. Only `"AppImage"` is implemented today - `deb`, `rpm`, `MSIX` and `NSIS` are reserved for later.
 */

/**
 * Main module exported.
 * @async
 * @function
 * @param  {Options}       options  Options
 * @returns {Promise<child_process.ChildProcess | string | null | undefined>} - Returns the NW.js process in run mode, the path to the packaged artifact in package mode, otherwise `undefined`.
 */
async function nwbuild(options) {
  let built;
  let releaseInfo;
  /** @type {{path: string, json: import("./util.js").NodeManifest | undefined}} */
  let manifest = {
    path: "",
    json: undefined,
  };

  try {
    /* Parse options */
    options = await util.parse(options, manifest);
    util.log("debug", "info", "Parse initial options");

    util.log("debug", "info", "Get node manifest...");
    manifest = await util.getNodeManifest({
      srcDir: /** @type {string | string[]} */ (options.srcDir),
      glob: /** @type {boolean} */ (options.glob),
    });
    if (typeof manifest.json?.nwbuild === "object") {
      options = { ...options, ...manifest.json.nwbuild };
    }

    util.log(
      "info",
      /** @type {"debug" | "error" | "info" | "warn"} */ (options.logLevel),
      "Parse final options using node manifest",
    );
    /** @type {Required<Options>} */
    const resolved = await util.parse(options, manifest.json);
    util.log(
      "debug",
      resolved.logLevel,
      `Manifest: ${manifest.path}\n${manifest.json}\n`,
    );

    built = fs.existsSync(resolved.cacheDir);
    if (built === false) {
      await fs.promises.mkdir(resolved.cacheDir, { recursive: true });
    }

    if (resolved.mode === "build" || resolved.mode === "package") {
      built = fs.existsSync(resolved.outDir);
      if (built === false) {
        await fs.promises.mkdir(resolved.outDir, { recursive: true });
      }
    }

    /* Validate options.version to get the version specific release info */
    util.log("info", resolved.logLevel, "Get version specific release info...");
    releaseInfo = await util.getReleaseInfo(
      resolved.version,
      resolved.platform,
      resolved.arch,
      resolved.cacheDir,
      resolved.manifestUrl,
    );
    util.log(
      "debug",
      resolved.logLevel,
      `Release info:\n${JSON.stringify(releaseInfo, null, 2)}\n`,
    );

    util.log("info", resolved.logLevel, "Validate options.* ...");
    await util.validate(resolved, releaseInfo);
    util.log(
      "debug",
      resolved.logLevel,
      `Options:\n${JSON.stringify(resolved, null, 2)}`,
    );

    /* Remove leading "v" from version string. `validate` already threw if `releaseInfo` was undefined. */
    resolved.version = /** @type {import("./util.js").ReleaseInfo} */ (
      releaseInfo
    ).version.slice(1);

    util.log(
      "info",
      resolved.logLevel,
      "Getting NW.js and related binaries...",
    );
    await get({
      version: resolved.version,
      flavor: resolved.flavor,
      platform: resolved.platform,
      arch: resolved.arch,
      downloadUrl: /** @type {"https://dl.nwjs.io"} */ (resolved.downloadUrl),
      manifestUrl: /** @type {"https://nwjs.io/versions.json"} */ (
        resolved.manifestUrl
      ),
      cacheDir: resolved.cacheDir,
      cache: resolved.cache,
      ffmpeg: resolved.ffmpeg,
      nativeAddon: resolved.nativeAddon,
      shaSum: resolved.shaSum,
    });

    if (resolved.mode === "get") {
      // Do nothing else since we have already downloaded the binaries.
      return undefined;
    }

    if (resolved.mode === "run") {
      util.log("info", resolved.logLevel, "Running NW.js in run mode...");
      if (resolved.glob) {
        throw new Error(
          "Glob option is not supported when mode is set to run.",
        );
      }
      const nwProcess = await run({
        version: resolved.version,
        flavor: resolved.flavor,
        platform: resolved.platform,
        arch: resolved.arch,
        srcDir: /** @type {string} */ (resolved.srcDir),
        cacheDir: resolved.cacheDir,
        argv: resolved.argv,
      });
      return nwProcess;
    } else if (resolved.mode === "build" || resolved.mode === "package") {
      util.log(
        "info",
        resolved.logLevel,
        `Build a NW.js application for ${resolved.platform} ${resolved.arch}...`,
      );
      await bld({
        version: resolved.version,
        flavor: resolved.flavor,
        platform: resolved.platform,
        arch: resolved.arch,
        manifestUrl: resolved.manifestUrl,
        srcDir: /** @type {string} */ (resolved.srcDir),
        cacheDir: resolved.cacheDir,
        outDir: resolved.outDir,
        app: /** @type {import("@nwutils/builder").LinuxRc | import("@nwutils/builder").WinRc | import("@nwutils/builder").OsxRc} */ (
          resolved.app
        ),
        glob: resolved.glob,
        managedManifest: resolved.managedManifest,
        /* `zip` would delete `outDir` before package mode can read it back; `validate` already rejects the two together. */
        zip: resolved.mode === "package" ? false : resolved.zip,
        releaseInfo: releaseInfo,
      });
      util.log(
        "info",
        resolved.logLevel,
        `Appliction is available at ${path.resolve(resolved.outDir)}`,
      );

      if (resolved.mode === "package") {
        util.log(
          "info",
          resolved.logLevel,
          `Packaging NW.js application as ${resolved.format}...`,
        );
        const packagePath = await packageApp({
          format: resolved.format,
          appDir: resolved.outDir,
          appName: /** @type {{ name: string }} */ (resolved.app).name,
          arch: resolved.arch,
          cacheDir: resolved.cacheDir,
          cache: resolved.cache,
          outDir: resolved.outDir,
        });
        util.log(
          "info",
          resolved.logLevel,
          `${resolved.format} is available at ${packagePath}`,
        );
        return packagePath;
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return undefined;
}

export default nwbuild;
