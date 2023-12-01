import child_process from "node:child_process";
import path from "node:path";
import process from "node:process";

import * as logger from "./log.js";
import * as util from "./util.js";

const { log } = logger;

/**
 * @typedef {object} RunOptions
 * @property {string | "latest" | "stable" | "lts"} [options.version = "latest"]    Runtime version
 * @property {"normal" | "sdk"}                     [options.flavor = "normal"]     Build flavor
 * @property {"linux" | "osx" | "win"}              [options.platform]              Target platform
 * @property {"ia32" | "x64" | "arm64"}             [options.arch]                  Target architecture
 * @property {string}                               [options.srcDir = "./src"]      Source directory
 * @property {string}                               [options.cacheDir = "./cache"]  Cache directory
 * @property {boolean}                              [options.glob = false]          If true, error is thrown.
 * @property {string[]}                             [options.argv = []]             If true, ffmpeg is not downloaded
 */

/**
 * Run NW.js application
 *
 * @async
 * @function
 * @param  {options}       options  Run mode options
 * @return {Promise<void>}
 *
 * @example
 * // Minimal Usage (uses default values)
 * nwbuild({
 *   mode: "run",
 * });
 */
export async function run({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  srcDir = "./src",
  cacheDir = "./cache",
  glob = false,
  argv = [],
}) {
  try {
    if (util.EXE_NAME[platform] === undefined) {
      throw new Error("Unsupported platform.");
    }
    if (glob === true) {
      throw new Error("Globbing is not supported with run mode.");
    }

    const nwDir = path.resolve(
      cacheDir,
      `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
    );

    return new Promise((res, rej) => {
      // It is assumed that the package.json is located at srcDir/package.json
      const nwProcess = child_process.spawn(
        path.resolve(nwDir, util.EXE_NAME[platform]),
        [...[srcDir], ...argv],
        {
          detached: true,
          windowsHide: true,
        },
      );

      nwProcess.on("close", () => {
        res();
      });

      nwProcess.on("error", (error) => {
        log.error(error);
        rej(error);
      });
    });
  } catch (error) {
    log.error(error);
  }
}
