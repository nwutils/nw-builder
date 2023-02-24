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
      url = `${downloadUrl}/v${version}/nwjs${
        flavor === "sdk" ? "-sdk" : ""
      }-v${version}-${platform}-${architecture}.${
        platform === "linux" ? "tar.gz" : "zip"
      }`;
      out = resolve(cacheDir, `nw.${platform === "linux" ? "tar.gz" : "zip"}`);
    } else if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      url = `${downloadUrl}/${version}/${version}-${platform}-${architecture}.zip`;
      out = resolve(cacheDir, `ffmpeg.zip`);
    } else {
      rej(new Error("Invalid download url. Please try again."));
    }

    if (
      downloadUrl ===
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download"
    ) {
      console.log("here");
      https.get(url, (response) => {
        url = response.headers.location;
        console.log(url);
        response.destroy();

        response.on("error", (error) => {
          rej(error);
        });
      });
    }

    https.get(url, (response) => {
      console.log(url);
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
  });
};

export { download };
