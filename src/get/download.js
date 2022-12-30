import fs from "node:fs";
import https from "node:https";

import progress from "cli-progress";

import { log } from "../log.js";

const bar = new progress.SingleBar({}, progress.Presets.rect);

/**
 * Downloads a zip or tar.gz file from a url
 *
 * @param  {string}                  version       The version of nw.js to download
 * @param  {"normal" | "sdk"}        flavor        The flavor of nw.js to download
 * @param  {"win" | "osx" | "linux"} platform      The platform to download for
 * @param  {"x64" | "ia32"}          architecture  The architecture to download for
 * @param  {string}                  downloadUrl   The url to download from
 * @param  {string}                  outDir        The directory to download into
 * @return {Promise<undefined>}                    The exit code
 */
const download = (
  version,
  flavor,
  platform,
  architecture,
  downloadUrl,
  outDir,
) => {
  return new Promise((resolve, reject) => {
    if (downloadUrl !== "https://dl.nwjs.io") {
      log.error("Invalid download url. Please try again.");
      reject(new Error("Invalid download url. Please try again."));
    }

    let url = `${downloadUrl}/v${version}/nwjs${
      flavor === "sdk" ? "-sdk" : ""
    }-v${version}-${platform}-${architecture}.${
      platform === "linux" ? "tar.gz" : "zip"
    }`;

    https.get(url, (res) => {
      let chunks = 0;
      bar.start(Number(res.headers["content-length"]), 0);

      res.on("data", (chunk) => {
        chunks += chunk.length;
        bar.increment();
        bar.update(chunks);
      });

      res.on("error", (error) => {
        log.error(error);
        reject(error);
      });

      res.on("end", () => {
        bar.stop();
        resolve();
      });

      fs.mkdirSync(outDir, { recursive: true });
      const stream = fs.createWriteStream(
        `${outDir}/nw.${platform === "linux" ? "tar.gz" : "zip"}`,
      );
      res.pipe(stream);
    });
  });
};

export { download };
