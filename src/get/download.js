import fs from "node:fs";
import { resolve } from "node:path";
import https from "https";

import progress from "cli-progress";

const bar = new progress.SingleBar({}, progress.Presets.rect);

/**
 * Download NW.js binary
 *
 * @param  {string}        version       Version
 * @param  {string}        flavor        Flavor
 * @param  {string}        platform      Platform
 * @param  {string}        architecture  Architecture
 * @param  {string}        downloadUrl   Download url
 * @param  {string}        cacheDir      Output directory
 * @return {Promise<void>}
 */
const download = (
  version,
  flavor,
  platform,
  architecture,
  downloadUrl,
  cacheDir,
) => {
  let url;
  let out;
  return new Promise((res, rej) => {
    if (downloadUrl === "https://dl.nwjs.io") {
      url = `${downloadUrl}/v${version}/nwjs${flavor === "sdk" ? "-sdk" : ""
        }-v${version}-${platform}-${architecture}.${platform === "linux" ? "tar.gz" : "zip"
        }`;
      out = resolve(cacheDir, `nw.${platform === "linux" ? "tar.gz" : "zip"}`);
    } else if (downloadUrl === "https://github.com/corwin-of-amber/nw.js/releases/download") {
      url = `${downloadUrl}/nw-v${version}/nwjs-${flavor === "sdk" ? "sdk-" : ""}v${version}-${platform}-${architecture}.zip`;
      out = resolve(cacheDir, `nw.zip`);
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      url = `${downloadUrl}/${version}/${version}-${platform}-${architecture}.zip`;
      out = resolve(cacheDir, `ffmpeg.zip`);
    } else {
      rej(new Error("Invalid download url. Please try again."));
    }

    https.get(url, (response) => {
      // For GitHub releases, we need to follow the redirect
      if (
        downloadUrl ===
        "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download" ||
        downloadUrl ===
        "https://github.com/corwin-of-amber/nw.js/releases/download"
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

        fs.mkdirSync(cacheDir, { recursive: true });
        const stream = fs.createWriteStream(out);
        response.pipe(stream);
      });

      response.on("error", (error) => {
        rej(error);
      });
    });
  });
};

export { download };
