import { createWriteStream } from "node:fs";

import { readdir, rm, rmdir } from "node:fs/promises";
import { get as getRequest } from "node:https";
import { resolve } from "node:path";
import { arch as ARCH, platform as PLATFORM } from "node:process";

import progress from "cli-progress";
import compressing from "compressing";

const PLATFORM_KV = {
  darwin: "osx",
  linux: "linux",
  win32: "windows",
};

const ARCH_KV = {
  x64: "x64",
  ia32: "ia32",
  arm64: "arm64",
};

/**
 * Get NW.js binaries
 *
 * @param  {object}                       options
 * @param  {"latest" | "stable" | string} options.version      [options.version="latest"]
 * @param  {"normal" | "sdk"}             options.flavor       [options.flavor="normal"]
 * @param  {"linux" | "osx" | "win"}      options.platform     options.platform
 * @param  {"ia32" | "x64" | "arm64"}     options.arch         options.arch
 * @param  {string}                       options.downloadUrl  [options.downloadUrl="https://dl.nwjs.io"]
 * @param  {string}                       options.manifestUrl  [options.manifestUrl="https://nwjs.io/versions"]
 * @param  {string}                       options.cacheDir     [options.cacheDir="./cache"]
 * @param  {boolean}                      options.cache        [options.cache=true]
 * @param  {boolean}                      options.ffmpeg       [options.ffmpeg=false]
 * @return {Promise<void>}
 */
export async function get({
  version = "latest",
  flavor = "normal",
  platform = PLATFORM_KV[PLATFORM],
  arch = ARCH_KV[ARCH],
  downloadUrl = "https://dl.nwjs.io",
  manifestUrl = "https://nwjs.io/versions",
  cacheDir = "./cache",
  cache = true,
  ffmpeg = false,
}) {
  let nwCached = true;
  let nwDir = resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`
  );
  let out = undefined;
  let url = undefined;
  const bar = new progress.SingleBar({}, progress.Presets.rect);

  // Set download url and destination.
  if (
    downloadUrl === "https://dl.nwjs.io" ||
    downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
    downloadUrl === "https://npmmirror.com/mirrors/nwjs"
  ) {
    url = `${downloadUrl}/v${version}/nwjs${flavor === "sdk" ? "-sdk" : ""
      }-v${version}-${platform}-${arch}.${platform === "linux" ? "tar.gz" : "zip"
      }`;
    out = resolve(cacheDir, `nw.${platform === "linux" ? "tgz" : "zip"}`);
  }

  // If options.ffmpeg is true, then download ffmpeg.
  if (ffmpeg === true) {
    downloadUrl =
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download";
    url = `${downloadUrl}/${version}/${version}-${platform}-${arch}.zip`;
    out = resolve(cacheDir, `ffmpeg.zip`);
  }

  // If options.cache is false, remove cache.
  if (cache === false) {
    rmdir(nwDir, { recursive: true, force: true });
  }

  // Check if cache exists.
  try {
    await readdir(nwDir);
  } catch (error) {
    nwCached = false;
  }

  // If not cached, then download.
  if (nwCached === false) {
    const stream = createWriteStream(out);

    const request = new Promise((resolve, reject) => {
      getRequest(url, (response) => {
        // For GitHub releases and mirrors, we need to follow the redirect.
        if (
          downloadUrl ===
          "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download" ||
          downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
          downloadUrl === "https://npmmirror.com/mirrors/nwjs"
        ) {
          url = response.headers.location;
        }

        getRequest(url, (response) => {
          let chunks = 0;
          bar.start(Number(response.headers["content-length"]), 0);
          response.on("data", async (chunk) => {
            chunks += chunk.length;
            bar.increment();
            bar.update(chunks);
          });

          response.on("error", (error) => {
            reject(error);
          });

          response.on("end", async () => {
            bar.stop();
            if (platform === "linux") {
              await compressing.tgz.uncompress(out, cacheDir);
            } else {
              await compressing.zip.uncompress(out, cacheDir);
            }

            resolve();
          });

          response.pipe(stream);
        });

        response.on("error", (error) => {
          reject(error);
        });
      });
    });

    request.then(async () => {
      await rm(resolve(cacheDir, "ffmpeg.zip"), {
        recursive: true,
        force: true,
      });

      await rm(
        resolve(cacheDir, `nw.${platform === "linux" ? "tgz" : "zip"}`),
        { recursive: true, force: true }
      );
    });
  }
}

get({
  version: "0.73.0",
  flavor: "normal",
  platform: "win",
  arch: "x64",
  cacheDir: "./test/fixture/cache",
});
