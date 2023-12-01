import { spawn } from "node:child_process";
import console from "node:console";
import { resolve } from "node:path";
import { arch as ARCH, platform as PLATFORM } from "node:process";

import { EXE_NAME, ARCH_KV, PLATFORM_KV } from "./util.js";

/**
 * @typedef {object} RunOptions
 * @property {string | "latest" | "stable" | "lts"} [options.version = "latest"]                  Runtime version
 * @property {"normal" | "sdk"}                     [options.flavor = "normal"]                   Build flavor
 * @property {"linux" | "osx" | "win"}              [options.platform]                            Target platform
 * @property {"ia32" | "x64" | "arm64"}             [options.arch]                                Target arch
 * @property {string}                               [options.srcDir = "./src"]                    Source directory
 * @property {string}                               [options.cacheDir = "./cache"]                Cache directory
 * @property {boolean}                              [options.glob = false]                        If true, throw error
 * @property {string[]}                             [options.argv = []]                           CLI arguments
 */

/**
 * Run NW.js application
 * 
 * @param  {RunOptions}               options           Run mode options
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
  platform = PLATFORM_KV[PLATFORM],
  arch = ARCH_KV[ARCH],
  srcDir = "./src",
  cacheDir = "./cache",
  glob = false,
  argv = [],
}) {
  try {
    if (EXE_NAME[platform] === undefined) {
      throw new Error("Unsupported platform.");
    }
    if (glob === true) {
      throw new Error("Globbing is not supported with run mode.");
    }

    const nwDir = resolve(
      cacheDir,
      `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
    );

    return new Promise((res, rej) => {
      // It is assumed that the package.json is located at srcDir/package.json
      const nwProcess = spawn(
        resolve(nwDir, EXE_NAME[platform]),
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
        console.error(error);
        rej(error);
      });
    });
  } catch (error) {
    console.error(error);
  }
}
