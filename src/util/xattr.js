import { exec } from "node:child_process";
import { resolve } from "node:path";

import { log } from "../log.js";

/**
 * Remove the quarantine attribute from the app bundle
 *
 * @param  {string}        platform  - The platform to build for
 * @param  {string}        arch      - The arch to build for
 * @param  {string}        nwDir     - The path to the nw directory
 * @return {Promise<void>}           - A promise that resolves when the attribute is removed
 */
export const xattr = (platform, arch, nwDir) => {
  return new Promise((res, rej) => {
    if (platform === "osx" && arch === "arm64") {
      let app = resolve(nwDir, "nwjs.app");
      exec(`sudo xattr -d com.apple.quarantine ${app}`, (err, stdout) => {
        log.debug(stdout);
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    } else {
      res();
    }
  });
};
