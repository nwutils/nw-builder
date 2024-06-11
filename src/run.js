import child_process from "node:child_process";
import console from "node:console";
import path from "node:path";
import process from "node:process";

import util from "./util.js";

/**
 * @typedef {object} RunOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]    Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]     Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]              Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                  Target arch
 * @property {string}                               [srcDir = "./src"]      Source directory
 * @property {string}                               [cacheDir = "./cache"]  Cache directory
 * @property {boolean}                              [glob = false]          If true, throw error
 * @property {string[]}                             [argv = []]             CLI arguments
 */

/**
 * Run NW.js application.
 *
 * @deprecated since v4.6.0. This logic will be ported over to `nwjs/npm-installer` repo and removed in the next major release (v5.0).
 *
 * @async
 * @function
 *
 * @param  {RunOptions}    options  Run mode options
 * @return {Promise<void>}
 */
async function run({
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
        { stdio: "inherit" },
      );

      nwProcess.on("close", () => {
        res();
      });

      nwProcess.on("error", (error) => {
        console.error(error);
        rej(error);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

export default run;
