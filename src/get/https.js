import fs from "node:fs";
import https from "node:https";

import progress from "cli-progress";

/**
 * Download from `url` to `outFile` file path.
 * 
 * @param {string} url - Download server
 * @param {string} outFile - File path of downloaded content
 * @returns {Promise<void>}
 */
export default async function getRequest(url, outFile) {

  /**
   * @type {number}
   */
  let chunks = 0;

  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const writeStream = fs.createWriteStream(outFile);

  return new Promise((resolve, reject) => {
    https.get(url, function (response) {

      bar.start(Number(response.headers["content-length"]), 0);

      response.on("data", function (chunk) {
        chunks += chunk.length;
        bar.increment();
        bar.update(chunks);
      });

      response.on("error", function (error) {
        reject(error);
      });

      response.on("end", () => {
        bar.stop();
        resolve();
      });

      response.pipe(writeStream);

    });
  });
}
