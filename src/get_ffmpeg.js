import { createWriteStream, existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { get as getRequest } from "node:https";
import { resolve } from "node:path";
import { arch as ARCH, platform as PLATFORM } from "node:process";

import progress from "cli-progress";
import compressing from "compressing";

import { log } from "./log.js";
import { PLATFORM_KV, ARCH_KV } from "./util.js";
import { replaceFfmpeg } from "./util/ffmpeg.js";

/**
 * _Note: This an internal function which is not called directly. Please see example usage below._
 *
 * Get FFMPEG binaries.
 *
 * @example
 * // FFMPEG (proprietary codecs)
 * // Please read the license's constraints: https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community
 * nwbuild({
 *   mode: "get",
 *   ffmpeg: true,
 * });
 *
 * @param  {object}                   options           Get mode options
 * @param  {string}                   options.version   NW.js runtime version. Defaults to "latest".
 * @param  {"normal" | "sdk"}         options.flavor    NW.js build flavor. Defaults to "normal".
 * @param  {"linux" | "osx" | "win"}  options.platform  Target platform. Defaults to host platform.
 * @param  {"ia32" | "x64" | "arm64"} options.arch      Target architecture. Defaults to host architecture.
 * @param  {string}                   options.cacheDir  Cache directory path. Defaults to "./cache"
 * @param  {boolean}                  options.cache     If false, remove cache before download. Defaults to true.
 * @return {Promise<void>}
 */
export async function get_ffmpeg({
  version = "latest",
  flavor = "normal",
  platform = PLATFORM_KV[PLATFORM],
  arch = ARCH_KV[ARCH],
  cacheDir = "./cache",
  cache = true,
}) {
  log.debug(`Start getting binaries`);
  let ffmpegCached = true;
  const nwDir = resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
  );
  const bar = new progress.SingleBar({}, progress.Presets.rect);

  // If options.ffmpeg is true, then download ffmpeg.
  const downloadUrl =
    "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download";
  let url = `${downloadUrl}/${version}/${version}-${platform}-${arch}.zip`;
  const out = resolve(cacheDir, `ffmpeg.zip`);

  // If options.cache is false, remove cache.
  if (cache === false) {
    log.debug(`Removing existing binaries`);
    await rm(out, {
      recursive: true,
      force: true,
    });
  }

  // Check if cache exists.
  if (existsSync(out)) {
    log.debug(`Found existing FFMPEG cache`);
    return;
  } else {
    log.debug(`No existing FFMPEG cache`);
    ffmpegCached = false;
  }

  // If not cached, then download.
  if (ffmpegCached === false) {
    log.debug(`Downloading FFMPEG`);

    const stream = createWriteStream(out);
    const request = new Promise((resolve, reject) => {
      getRequest(url, (response) => {
        log.debug(`Response from ${url}`);
        // For GitHub releases and mirrors, we need to follow the redirect.
        url = response.headers.location;

        getRequest(url, (response) => {
          log.debug(`Response from ${url}`);
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

          response.on("end", () => {
            log.debug(`FFMPEG fully downloaded`);
            bar.stop();
            if (platform === "linux") {
              compressing.tgz.uncompress(out, nwDir).then(() => resolve());
            } else {
              compressing.zip.uncompress(out, nwDir).then(() => resolve());
            }
          });

          response.pipe(stream);
        });

        response.on("error", (error) => {
          reject(error);
        });
      });
    });

    // Remove compressed file after download and decompress.
    return request.then(async () => {
      let ffmpegFile;
      if (platform === "linux") {
        ffmpegFile = "libffmpeg.so";
      } else if (platform === "win") {
        ffmpegFile = "ffmpeg.dll";
      } else if (platform === "osx") {
        ffmpegFile = "libffmpeg.dylib";
      }
      await replaceFfmpeg(platform, nwDir, ffmpegFile);

      if (cache === false) {
        log.debug(`Removing FFMPEG zip cache`);
        await rm(resolve(cacheDir, "ffmpeg.zip"), {
          recursive: true,
          force: true,
        });
        log.debug(`FFMPEG zip cache removed`);
      }
    });
  }
}
