import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

import { decompress } from "./get/decompress.js";
import { download } from "./get/download.js";
import { getReleaseInfo } from "./get/getReleaseInfo.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";
import { develop } from "./run/develop.js";
import { isCached } from "./util/cache.js";
import { getOptions } from "./util/options.js";
import { parse } from "./util/parse.js";
import { validate } from "./util/validate.js";

import { log } from "./log.js";

/**
 * @typedef {object} App
 * @property {string}   name                  Name of the application
 *                                            Linux configuration options
 * @property {string}   genericName           Generic name of the application
 * @property {boolean}  noDisplay             If true the application is not displayed
 * @property {string}   comment               Tooltip for the entry, for example "View sites on the Internet".
 * @property {string}   icon                  Icon to display in file manager, menus, etc.
 * @property {boolean}  hidden                TBD
 * @property {string[]} onlyShowIn            A list of strings identifying the desktop environments that should (/not) display a given desktop entry
 * @property {string[]} notShowIn             A list of strings identifying the desktop environments that should (/not) display a given desktop entry
 * @property {boolean}  dBusActivatable       A boolean value specifying if D-Bus activation is supported for this application
 * @property {string}   tryExec               Path to an executable file on disk used to determine if the program is actually installed
 * @property {string}   exec                  Program to execute, possibly with arguments.
 * @property {string}   path                  If entry is of type Application, the working directory to run the program in.
 * @property {boolean}  terminal              Whether the program runs in a terminal window.
 * @property {string[]} actions               Identifiers for application actions.
 * @property {string[]} mimeType              The MIME type(s) supported by this application.
 * @property {string[]} categories            Categories in which the entry should be shown in a menu
 * @property {string[]} implements            A list of interfaces that this application implements.
 * @property {string[]} keywords              A list of strings which may be used in addition to other metadata to describe this entry.
 * @property {boolean}  startupNotify         If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all.
 * @property {string}   startupWMClass        If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin
 * @property {boolean}  prefersNonDefaultGPU  If true, the application prefers to be run on a more powerful discrete GPU if available.
 * @property {string}   singleMainWindow      If true, the application has a single main window, and does not support having an additional one opened.
 *                                            Windows configuration options
 * @property {string}   comments              Additional information that should be displayed for diagnostic purposes.
 * @property {string}   company               Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required.
 * @property {string}   fileDescription       File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required.
 * @property {string}   fileVersion           Version number of the file. For example, 3.10 or 5.00.RC2. This string is required.
 * @property {string}   internalName          Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required.
 * @property {string}   legalCopyright        Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional.
 * @property {string}   legalTrademark        Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional.
 * @property {string}   originalFilename      Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required.
 * @property {string}   privateBuild          Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block.
 * @property {string}   productName           Name of the product with which the file is distributed. This string is required.
 * @property {string}   productVersion        Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required.
 * @property {string}   specialBuild          Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block.
 */

/**
 * @typedef {object} Options
 * @property {string}                       [srcDir="./"]                             String of space separated glob patterns which correspond to NW app code
 * @property {"run" | "build"}              [mode="build"]                            Run or build application
 * @property {"latest" | "stable" | string} [version="latest"]                        NW runtime version
 * @property {"normal" | "sdk"}             [flavor="normal"]                         NW runtime build flavor
 * @property {"linux" | "osx" | "win"}      platform                                  NW supported platforms
 * @property {"ia32" | "x64"}               arch                                      NW supported architectures
 * @property {string}                       [outDir="./out"]                          Directory to store build artifacts
 * @property {"./cache" | string}           [cacheDir="./cache"]                      Directory to store NW binaries
 * @property {"https://dl.nwjs.io"}         [downloadUrl="https://dl.nwjs.io"]        URI to download NW binaries from
 * @property {"https://nwjs.io/versions"}   [manifestUrl="https://nwjs.io/versions"]  URI to download manifest from
 * @property {App}                          app                                       Multi platform configuration options
 * @property {boolean}                      [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
 * @property {boolean}                      [zip=false]                               If true the outDir directory is zipped
 * @property {boolean}                      [cli=false]                               If true the CLI is used to glob srcDir and parse other options
 */

/**
 * Entry point for nw-builder application
 *
 * @param  {...Options}         options  Options
 * @return {Promise<undefined>}
 */
const nwbuild = async (options) => {
  let nwDir = "";
  let ffmpegFile = "";
  let cached;
  let nwCached;
  let built;
  let releaseInfo = {};

  try {
    const { opts, files, nwPkg } = await getOptions(options);
    options = opts;

    // Parse options
    options = await parse(options, nwPkg);

    // Create cacheDir if it does not exist
    cached = await isCached(options.cacheDir);
    if (cached === false) {
      await mkdir(options.cacheDir, { recursive: true });
    }

    // Create outDir if it does not exist
    built = await isCached(options.outDir);
    if (built === false) {
      await mkdir(options.outDir, { recursive: true });
    }

    // Validate options.version to get the version specific release info
    releaseInfo = await getReleaseInfo(
      options.version,
      options.cacheDir,
      options.manifestUrl,
    );
    // Remove leading "v" from version string
    options.version = releaseInfo.version.slice(1);

    await validate(options, releaseInfo);

    // Variable to store nwDir file path
    nwDir = resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${
        options.platform
      }-${options.arch}`,
    );

    nwCached = await isCached(nwDir);
    // Remove cached NW binary
    if (options.cache === false && nwCached === true) {
      log.debug("Remove cached NW binary");
      await rm(nwDir, { force: true, recursive: true });
    }
    // Download relevant NW.js binaries
    if (nwCached === false) {
      log.debug("Download relevant NW.js binaries");
      await download(
        options.version,
        options.flavor,
        options.platform,
        options.arch,
        options.downloadUrl,
        options.cacheDir,
      );
      await decompress(options.platform, options.cacheDir, options.downloadUrl);
      await remove(options.platform, options.cacheDir, options.downloadUrl);
    }

    if (options.platform === "win") {
      ffmpegFile = ".dll";
    } else if (options.platform === "osx") {
      ffmpegFile = ".dylib";
    } else if (options.platform === "linux") {
      ffmpegFile = "libffmpeg.so";
    }
    ffmpegFile = resolve(options.cacheDir, ffmpegFile);
    const ffmpegCached = await isCached(ffmpegFile);
    // Remove cached ffmpeg binary
    if (options.cache === false && ffmpegCached === true) {
      log.debug("Remove cached ffmpeg binary");
      await rm(ffmpegFile, { force: true, recursive: true });
    }

    // Download relevant ffmpeg binaries
    if (ffmpegCached === false) {
      log.debug("Download relevant ffmpeg binaries");
      await download(
        options.version,
        options.flavor,
        options.platform,
        options.arch,
        "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
        options.cacheDir,
      );
      await decompress(
        options.platform,
        options.cacheDir,
        "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
      );
      // await remove(options.platform, options.cacheDir, "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download");
    }

    if (options.mode === "run") {
      await develop(options.srcDir, nwDir, options.platform, options.argv);
    }
    if (options.mode === "build") {
      await packager(
        files,
        nwDir,
        options.outDir,
        options.platform,
        options.zip,
        releaseInfo,
        options.app,
      );
    }
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export default nwbuild;
