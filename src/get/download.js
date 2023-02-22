import fs from "node:fs";
import { resolve } from "node:path";
import https from "node:https";

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
 * @param  {string}        outDir        Output directory
 * @return {Promise<void>}
 */
const download = (
  version,
  flavor,
  platform,
  architecture,
  downloadUrl,
  outDir,
) => {
  let url;
  let out;
  return new Promise((res, rej) => {
    if (downloadUrl === "https://dl.nwjs.io") {
      url = `${downloadUrl}/v${version}/nwjs${flavor === "sdk" ? "-sdk" : ""
        }-v${version}-${platform}-${architecture}.${platform === "linux" ? "tar.gz" : "zip"
        }`;
      out = resolve(outDir, `nw.${platform === "linux" ? "tar.gz" : "zip"}`);
    } else {
      rej(new Error("Invalid download url. Please try again."));
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

      fs.mkdirSync(outDir, { recursive: true });
      const stream = fs.createWriteStream(out);
      response.pipe(stream);
    });
  });
};

export { download };
