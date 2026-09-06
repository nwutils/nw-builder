import child_process from "node:child_process";
import path from "node:path";

/**
 * @typedef {object} Options
 * @property {string | "latest" | "stable" | "lts"} version     Runtime version
 * @property {"normal" | "sdk"}                     flavor      Build flavor
 * @property {"linux" | "osx" | "win"}              platform    Target platform
 * @property {"ia32" | "x64" | "arm64"}             arch        Target arch
 * @property {string}                               srcDir      Source directory
 * @property {string}                               cacheDir    Cache directory
 * @property {string[]}                             argv        CLI arguments
 */

const EXE_NAME = {
  win: "nw.exe",
  osx: "nwjs.app/Contents/MacOS/nwjs",
  linux: "nw",
};

const VALID_ARCHES = ["ia32", "x64", "arm64"];

const VALID_FLAVORS = ["normal", "sdk"];

const VALID_VERSION = /^(latest|stable|lts|[\w.+-]+)$/;

/**
 * Run NW.js application.
 * @async
 * @function
 * @param  {Options}    options  Options
 * @returns {Promise<child_process.ChildProcess | null>} - A Node.js process object
 */
async function run({
  version,
  flavor,
  platform,
  arch,
  srcDir,
  cacheDir,
  argv,
}) {
  if (!Object.prototype.hasOwnProperty.call(EXE_NAME, platform)) {
    throw new Error(`Invalid platform: ${platform}`);
  }

  if (!VALID_ARCHES.includes(arch)) {
    throw new Error(`Invalid arch: ${arch}`);
  }

  if (!VALID_FLAVORS.includes(flavor)) {
    throw new Error(`Invalid flavor: ${flavor}`);
  }

  if (
    typeof version !== "string" ||
    !VALID_VERSION.test(version) ||
    version.includes("..")
  ) {
    throw new Error(`Invalid version: ${version}`);
  }

  const resolvedCacheDir = path.resolve(cacheDir);

  const nwDir = path.resolve(
    resolvedCacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
  );

  const nwExe = path.resolve(nwDir, EXE_NAME[platform]);

  if (
    nwExe !== resolvedCacheDir &&
    !nwExe.startsWith(resolvedCacheDir + path.sep)
  ) {
    throw new Error("Resolved executable path escapes cacheDir");
  }

  if (!Array.isArray(argv) || !argv.every((arg) => typeof arg === "string")) {
    throw new Error("Invalid argv: expected an array of strings");
  }

  /**
   * @type {child_process.ChildProcess | null}
   */
  let nwProcess = child_process.spawn(nwExe, [...[srcDir], ...argv], {
    stdio: "inherit",
    shell: false,
  });

  nwProcess.on("close", () => {
    // define callback on close
  });

  nwProcess.on("error", () => {
    // define callback on error
  });

  return nwProcess;
}

export default run;
