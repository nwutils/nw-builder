import child_process from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import fsm from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import process from "node:process";

import progress from "cli-progress";
import compressing from "compressing";
import yauzl from "yauzl-promise";

import util from "./util.js";

import streamp from "node:stream/promises";

/**
 * @typedef {object} GetOptions
 * @property {string | "latest" | "stable" | "lts"} [options.version = "latest"]                  Runtime version
 * @property {import("./nwbuild.js").Options["flavor"]}                     [options.flavor = "normal"]                   Build flavor
 * @property {"linux" | "osx" | "win"}              [options.platform]                            Target platform
 * @property {"ia32" | "x64" | "arm64"}             [options.arch]                                Target arch
 * @property {string}                               [options.downloadUrl = "https://dl.nwjs.io"]  Download server
 * @property {string}                               [options.cacheDir = "./cache"]                Cache directory
 * @property {string}                               [options.outDir = "./out"]                    Out directory
 * @property {boolean}                              [options.cache = true]                        If false, remove cache and redownload.
 * @property {boolean}                              [options.ffmpeg = false]                      If true, ffmpeg is not downloaded.
 * @property {false | "gyp"}                        [options.nativeAddon = false]                 Rebuild native modules
 */

/**
 * Get binaries.
 * 
 * @async
 * @function
 * @param  {GetOptions}    options                  Get mode options
 * @returns {Promise<void>}
 *
 * @example
 * // Minimal Usage (uses default values)
 * nwbuild({
 *   mode: "get",
 * });
 *
 * @example
 * // Unofficial macOS builds (upto v0.75.0)
 * nwbuild({
 *   mode: "get",
 *   platform: "osx",
 *   arch: "arm64",
 *   downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
 *   manifestUrl: "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
 * });
 *
 * @example
 * // China mirror
 * nwbuild({
 *  mode: "get",
 *  downloadUrl: "https://npm.taobao.org/mirrors/nwjs",
 * });
 *
 * @example
 * // Singapore mirror
 * nwbuild({
 *  mode: "get",
 *  downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
 * });
 *
 * @example
 * // FFMPEG (proprietary codecs)
 * // Please read the license's constraints: https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community
 * nwbuild({
 *   mode: "get",
 *   ffmpeg: true,
 * });
 *
 * @example
 * // Node headers
 * nwbuild({
 *   mode: "get",
 *   nativeAddon: "gyp",
 * });
 */
async function get({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  downloadUrl = "https://dl.nwjs.io",
  cacheDir = "./cache",
  cache = true,
  ffmpeg = false,
  nativeAddon = false,
}) {
  await getNwjs({
    version,
    flavor,
    platform,
    arch,
    downloadUrl,
    cacheDir,
    cache,
  });
  if (ffmpeg === true) {
    await getFfmpeg({
      version,
      flavor,
      platform,
      arch,
      downloadUrl,
      cacheDir,
      cache,
    });
  }
  if (nativeAddon === "gyp") {
    await getNodeHeaders({
      version: version,
      platform: platform,
      arch: arch,
      cacheDir: cacheDir,
      cache: cache,
    });
  }
}

const getNwjs = async ({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  downloadUrl = "https://dl.nwjs.io",
  cacheDir = "./cache",
  cache = true,
}) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const out = path.resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}.${platform === "linux" ? "tar.gz" : "zip"
    }`,
  );
  // If options.cache is false, remove cache.
  if (cache === false) {
    await fsm.rm(out, {
      recursive: true,
      force: true,
    });
  }
  console.log('we here');

  if (fs.existsSync(out) === true) {
    await fsm.rm(
      path.resolve(
        cacheDir,
        `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
      ),
      { recursive: true, force: true },
    );
    if (true) {
      // if (platform === "osx" && process.platform === "darwin") {
      await decompressOSX({ out, cacheDir });
    } else {
      await compressing[platform === "linux" ? "tgz" : "zip"].uncompress(
        out,
        cacheDir,
      );
    }

    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    let url = "";

    // Set download url and destination.
    if (
      downloadUrl === "https://dl.nwjs.io" ||
      downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
      downloadUrl === "https://npmmirror.com/mirrors/nwjs"
    ) {
      url = `${downloadUrl}/v${version}/nwjs${flavor === "sdk" ? "-sdk" : ""
        }-v${version}-${platform}-${arch}.${platform === "linux" ? "tar.gz" : "zip"
        }`;
    }

    https.get(url, (response) => {
      // For GitHub releases and mirrors, we need to follow the redirect.
      if (
        downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
        downloadUrl === "https://npmmirror.com/mirrors/nwjs"
      ) {
        url = response.headers.location;
      }

      https.get(url, (response) => {
        let chunks = 0;
        bar.start(Number(response.headers["content-length"]), 0);
        response.on("data", (chunk) => {
          chunks += chunk.length;
          bar.increment();
          bar.update(chunks);
        });

        response.on("error", (error) => {
          rej(error);
        });

        response.on("end", () => {
          bar.stop();
          res();
        });

        response.pipe(stream);
      });

      response.on("error", (error) => {
        rej(error);
      });
    });
  });

  return request.then(async () => {
    await fsm.rm(
      path.resolve(
        cacheDir,
        `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
      ),
      { recursive: true, force: true },
    );
    if (platform === "osx" && process.platform === "darwin") {
      await decompressOSX({ out, cacheDir });
    } else {
      await compressing[platform === "linux" ? "tgz" : "zip"].uncompress(
        out,
        cacheDir,
      );
    }
  });
}


const getFfmpeg = async ({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  cacheDir = "./cache",
  cache = true,
}) => {
  const nwDir = path.resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
  );
  const bar = new progress.SingleBar({}, progress.Presets.rect);

  // If options.ffmpeg is true, then download ffmpeg.
  const downloadUrl =
    "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download";
  let url = `${downloadUrl}/${version}/${version}-${platform}-${arch}.zip`;
  const out = path.resolve(cacheDir, `ffmpeg-v${version}-${platform}-${arch}.zip`);

  // If options.cache is false, remove cache.
  if (cache === false) {
    await fsm.rm(out, {
      recursive: true,
      force: true,
    });
  }

  // Check if cache exists.
  if (fs.existsSync(out) === true) {
    await compressing.zip.uncompress(out, nwDir);
    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    https.get(url, (response) => {
      // For GitHub releases and mirrors, we need to follow the redirect.
      url = response.headers.location;

      https.get(url, (response) => {
        let chunks = 0;
        bar.start(Number(response.headers["content-length"]), 0);
        response.on("data", (chunk) => {
          chunks += chunk.length;
          bar.increment();
          bar.update(chunks);
        });

        response.on("error", (error) => {
          rej(error);
        });

        response.on("end", () => {
          bar.stop();
          res();
        });

        response.pipe(stream);
      });

      response.on("error", (error) => {
        rej(error);
      });
    });
  });

  // Remove compressed file after download and decompress.
  return request.then(async () => {
    await compressing.zip.uncompress(out, nwDir);
    await util.replaceFfmpeg(platform, nwDir);
  });
}

const getNodeHeaders = async ({
  version = "latest",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  cacheDir = "./cache",
  cache = true,
}) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const out = path.resolve(
    cacheDir,
    `headers-v${version}-${platform}-${arch}.tar.gz`,
  );

  // If options.cache is false, remove cache.
  if (cache === false) {
    await fsm.rm(out, {
      recursive: true,
      force: true,
    });
  }

  if (fs.existsSync(out) === true) {
    await compressing.tgz.uncompress(out, cacheDir);
    await fsm.rm(path.resolve(cacheDir, `node-v${version}-${platform}-${arch}`), {
      recursive: true,
      force: true,
    });
    await fsm.rename(
      path.resolve(cacheDir, "node"),
      path.resolve(cacheDir, `node-v${version}-${platform}-${arch}`),
    );

    child_process.exec(
      "patch " +
      path.resolve(
        cacheDir,
        `node-v${version}-${platform}-${arch}`,
        "common.gypi",
      ) +
      " " +
      path.resolve("..", "..", "patches", "node_header.patch"),
      (error) => {
        console.error(error);
      },
    );

    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    const urlBase = "https://dl.nwjs.io/";
    const url = `${urlBase}/v${version}/nw-headers-v${version}.tar.gz`;
    https.get(url, (response) => {
      let chunks = 0;
      bar.start(Number(response.headers["content-length"]), 0);
      response.on("data", (chunk) => {
        chunks += chunk.length;
        bar.increment();
        bar.update(chunks);
      });

      response.on("error", (error) => {
        rej(error);
      });

      response.on("end", () => {
        bar.stop();
        res();
      });

      response.pipe(stream);
    });
  });

  return request.then(async () => {
    await compressing.tgz.uncompress(out, cacheDir);
    await fsm.rename(
      path.resolve(cacheDir, "node"),
      path.resolve(cacheDir, `node-v${version}-${platform}-${arch}`),
    );
  });
}

const decompressOSX = async ({ out, cacheDir }) => {
  const zip = await yauzl.open(out);
  try {
    for await (const entry of zip) {
      const fullEntryPath = path.resolve(cacheDir, entry.filename);
      if (entry.filename.endsWith("/")) {
        await fsm.mkdir(fullEntryPath, { recursive: true });
      } else {
        await fsm.mkdir(path.dirname(fullEntryPath), { recursive: true });
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(fullEntryPath);
        await streamp.pipeline(readStream, writeStream)
      }
    }
  }
  catch (e) {
    console.error(e);
  } finally {
    await zip.close();
  }
}

export default get;
