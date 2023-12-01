import child_process from "node:child_process";
import path from "node:path";
import process from "node:process";

import * as logger from "./log.js";
import * as util from "./util.js";

const { log } = logger;



/**
 * _Note: This an internal function which is not called directly. Please see example usage below._
 *
 * Run NW.js application. You can use get mode options in run mode too.
 *
 * @example
 * // Minimal Usage (uses default values)
 * nwbuild({
 *   mode: "run",
 * });
 *
 * @param  {options}                  options           Run mode options
 * @param  {string}                   options.version   NW.js runtime version. Defaults to "latest".
 * @param  {"normal" | "sdk"}         options.flavor    NW.js build flavor. Defaults to "normal".
 * @param  {"linux" | "osx" | "win"}  options.platform  Target platform. Defaults to host platform.
 * @param  {"ia32" | "x64" | "arm64"} options.arch      Target architecture. Defaults to host architecture.
 * @param  {string}                   options.srcDir    Source directory path. Defaults to "./src"
 * @param  {string}                   options.cacheDir  Cache directory path. Defaults to "./cache"
 * @param  {boolean}                  options.glob      If true, file globbing is enabled. Defaults to false.
 * @param  {string[]}                 options.argv      Arguments to pass to NW.js. Defaults to []. See [NW.js CLI options](https://docs.nwjs.io/en/latest/References/Command%20Line%20Options/#command-line-options) for more information.
 * @return {Promise<void>}
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
