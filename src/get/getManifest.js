import { get } from "node:https";

import { log } from "../log.js";

/**
 * Get manifest (array of NW release metadata) from URL
 *
 * @param  {string}                       manifestUrl  Url to manifest
 * @return {Promise <object | undefined>}
 */
export const getManifest = (manifestUrl) => {
  let chunks = undefined;

  return new Promise((resolve, reject) => {
    get(manifestUrl, (res) => {
      res.on("data", (chunk) => {
        chunks += chunk;
      });

      res.on("error", (e) => {
        log.error(e);
        reject(undefined);
      });

      res.on("end", () => {
        log.info("Succesfully cached manifest metadata");
        resolve(chunks);
      });
    });
  });
};
