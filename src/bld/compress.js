import fs from "node:fs";
import archiver from "archiver";

import { log } from "../log.js";

/**
 * Compresses a directory into a zip file
 *
 * @param  {string}             outDir  The directory to compress
 * @param  {"zip" | string}     type    The type of compression to use
 * @return {Promise<undefined>}         The exit code
 */
const compress = (outDir, type = "zip") => {
  const output = fs.createWriteStream(`${outDir}.${type}`);
  const archive = archiver("zip");

  return new Promise((res, rej) => {
    output.on("close", () => {
      res();
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        log.debug(err);
      } else {
        rej(err);
      }
    });

    archive.on("error", (err) => {
      rej(err);
    });

    archive.pipe(output);
    archive.directory(outDir, false);
    archive.finalize();
  });
};

export { compress };
