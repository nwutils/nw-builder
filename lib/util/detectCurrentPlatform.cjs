/**
 * @readonly
 * @enum {string}
 */
const Platform = {
    NIX_32: "linux32",
    NIX_64: "linux64",
    OSX_32: "osx32",
    OSX_64: "osx64",
    WIN_32: "win32",
    WIN_64: "win64",
};

/**
 *
 * @param  {NodeJS.Process}       process
 * @return {Platform | undefined}
 */
function detectCurrentPlatform (process) {
    switch (process.platform) {
        case "darwin":
            return process.arch === "x64" ? Platform.OSX_64 : Platform.OSX_32;

        case "win32":
            return process.arch === "x64" ? Platform.WIN_64 : Platform.WIN_32;

        case "linux":
            return process.arch === "x64" ? Platform.NIX_64 : Platform.NIX_32;
        default:
            return undefined;
    }
};

module.exports = detectCurrentPlatform;
