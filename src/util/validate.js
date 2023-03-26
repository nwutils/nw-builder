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
  if (releaseInfo.components.node !== version.slice(1)) {
    return new Error(
      `NW.js ${releaseInfo.version} requires Node.js v${releaseInfo.components.node} but you are using Node.js ${version}.`,
    );
  }
  if (!["get", "run", "build"].includes(options.mode)) {
    throw new Error(
      `Unknown mode ${options.mode}. Expected "get", "run" or "build".`,
    );
  }
  // We don't validate version since getReleaseInfo already does that
  if (!releaseInfo.flavors.includes(options.flavor)) {
    throw new Error(
      `${options.flavor} flavor is not supported by this download server.`,
    );
  }
  if (
    options.platform &&
    options.arch &&
    !releaseInfo.files.includes(`${options.platform}-${options.arch}`)
  ) {
    throw new Error(
      `Platform ${options.platform} and architecture ${options.arch} is not supported by this download server.`,
    );
  }
  if (options.cacheDir) {
    await readdir(options.cacheDir);
  }
  if (typeof options.cache !== "boolean") {
    return new Error("Expected options.cache to be a boolean. Got " + typeof options.cache);
  }
  if (typeof options.ffmpeg !== "boolean") {
    return new Error("Expected options.ffmpeg to be a boolean. Got " + typeof options.ffmpeg);
  }

  if (options.mode === "get") {
    return undefined;
  }

  if (typeof options.argv !== "array") {
    return new Error("Expected options.argv to be an array. Got " + typeof options.argv);
  }

  if (options.srcDir) {
    await readdir(options.srcDir);
  }

  if (options.mode === "run") {
    return undefined;
  }

  if (options.outDir) {
    await readdir(options.outDir);
  }

  // TODO: Validate app options
  return undefined;
};
