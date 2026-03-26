export default run;
export type Options = {
    /**
     * Runtime version
     */
    version: string | "latest" | "stable" | "lts";
    /**
     * Build flavor
     */
    flavor: "normal" | "sdk";
    /**
     * Target platform
     */
    platform: "linux" | "osx" | "win";
    /**
     * Target arch
     */
    arch: "ia32" | "x64" | "arm64";
    /**
     * Source directory
     */
    srcDir: string;
    /**
     * Cache directory
     */
    cacheDir: string;
    /**
     * CLI arguments
     */
    argv: string[];
};
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
/**
 * Run NW.js application.
 * @async
 * @function
 * @param  {Options}    options  Options
 * @returns {Promise<child_process.ChildProcess | null>} - A Node.js process object
 */
declare function run({ version, flavor, platform, arch, srcDir, cacheDir, argv, }: Options): Promise<child_process.ChildProcess | null>;
import child_process from 'node:child_process';
