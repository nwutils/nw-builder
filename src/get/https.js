// import fs from "node:fs";
import https from "node:https";

import progress from "cli-progress";

/**
 * Download from `url` to `outFile` file path.
 * 
 * @param {string} url - Download server
 * @returns {Promise<Buffer>} - Downloaded content
 */
export default async function request(url) {

  /**
   * Tracks the download progress. Minimum is 0 and maximum is the size of file.
   * 
   * @type {number}
   */
  let chunkSize = 0;

  const bar = new progress.SingleBar({}, progress.Presets.rect);

  return new Promise((resolve, reject) => {
    https.get(url, function (response) {

      /**
       * @type {Buffer}
       */
      let responseBody = '';
      bar.start(Number(response.headers["content-length"]), 0);
      response.setEncoding('utf8');

      response.on("data", function (chunk) {
        chunkSize += chunk.length;
        responseBody += chunk;
        bar.increment();
        bar.update(chunkSize);
      });

      response.on("error", function (error) {
        reject(error);
      });

      response.on("end", () => {
        bar.stop();
        resolve(responseBody);
      });
    });
  });
}
