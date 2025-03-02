import child_process from 'node:child_process';
import console from 'node:console';
import path from 'node:path';
import process from 'node:process';

import util from './util.js';

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
 * @async
 * @function
 * @param  {RunOptions}    options  Run mode options
 * @returns {Promise<child_process.ChildProcess | null>} - A Node.js process object
 */
async function run({
  version = 'latest',
  flavor = 'normal',
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  srcDir = './src',
  cacheDir = './cache',
  glob = false,
  argv = [],
}) {
  /**
   * @type {child_process.ChildProcess | null}
   */
  let nwProcess = null;

  try {
    if (util.EXE_NAME[platform] === undefined) {
      throw new Error('Unsupported platform.');
    }
    if (glob === true) {
      throw new Error('Globbing is not supported with run mode.');
    }

    const nwDir = path.resolve(
      cacheDir,
      `nwjs${flavor === 'sdk' ? '-sdk' : ''}-v${version}-${platform}-${arch}`,
    );

    return new Promise((res, rej) => {
      /* It is assumed that the package.json is located at `${options.srcDir}/package.json` */
      nwProcess = child_process.spawn(
        path.resolve(nwDir, util.EXE_NAME[platform]),
        [...[srcDir], ...argv],
        { stdio: 'inherit' },
      );

      nwProcess.on('close', () => {
        res();
      });

      nwProcess.on('error', (error) => {
        console.error(error);
        rej(error);
      });
    });
  } catch (error) {
    console.error(error);
  }
  return nwProcess;
}

export default run;
