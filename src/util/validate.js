import { version } from "node:process";
import { readdir } from "node:fs/promises";

/**
 * Validate options
 *
 * @param  {import("../nwbuild").Options} options      Options
 * @param  {object}                       releaseInfo  Version specific NW release info
 * @return {Promise<undefined>}                        True if options are valid. False otherwise
 */
export const validate = async (options, releaseInfo) => {
  if (options.srcDir === "") {
    throw new Error("srcDir is empty");
  }
  if (
    options.mode !== "get" &&
    options.mode !== "run" &&
    options.mode !== "build"
  ) {
    throw new Error("Invalid mode value. Expected run or build.");
  }
  if (
    options.platform &&
    options.arch &&
    !releaseInfo.files.includes(`${options.platform}-${options.arch}`)
  ) {
    throw new Error(
      `Platform ${options.platform} and architecture ${options.arch} is not supported by this download server. Sorry!`,
    );
  }
  if (options.outDir) {
    await readdir(options.outDir);
  }
  if (releaseInfo.components.node !== version.slice(1)) {
    return new Error(`NW.js ${releaseInfo.version} requires Node.js v${releaseInfo.components.node} but you are using Node.js ${version.slice(1)}.`);
  }
  return undefined;
};
