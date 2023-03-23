import { readdir } from "node:fs/promises";

/**
 * Validate options
 *
 * @param  {import("../nwbuild").Options} options      Options
 * @param  {object}                       releaseInfo  Version specific NW release info
 * @param  {string}                       version      Node.js version
 * @return {Promise<undefined>}                        Return undefined if options are valid
 * @throws {Error}                                     Throw error if options are invalid
 */
export const validate = async (options, releaseInfo, version) => {
  if (options.mode === "get") {
    if (!releaseInfo.flavors.includes(options.flavor)) {
      throw new Error(
        `${options.flavor} flavor is not supported by this download server.`,
      );
    }
    // We don't validate version since getReleaseInfo already does that
    if (
      options.platform &&
      options.arch &&
      !releaseInfo.files.includes(`${options.platform}-${options.arch}`)
    ) {
      throw new Error(
        `Platform ${options.platform} and architecture ${options.arch} is not supported by this download server.`,
      );
    }
    if (releaseInfo.components.node !== version.slice(1)) {
      return new Error(
        `NW.js ${releaseInfo.version} requires Node.js v${releaseInfo.components.node} but you are using Node.js ${version}.`,
      );
    }
  } else if (options.mode === "run" || options.mode === "build") {
    if (options.srcDir === "") {
      throw new Error("srcDir is empty");
    }
    if (!releaseInfo.files.includes(`${options.platform}-${options.arch}`)) {
      throw new Error(
        `Platform ${options.platform} and architecture ${options.arch} is not supported by this download server. Sorry!`,
      );
    }
    if (options.outDir) {
      await readdir(options.outDir);
    }
    if (releaseInfo.components.node !== version.slice(1)) {
      return new Error(
        `NW.js ${releaseInfo.version} requires Node.js v${
          releaseInfo.components.node
        } but you are using Node.js ${version.slice(1)}.`,
      );
    }
  } else {
    throw new Error(
      `Unknown mode ${options.mode}. Expected "get", "run" or "build".`,
    );
  }
  return undefined;
};
