import { readFile, writeFile } from "node:fs/promises";
import { get } from "node:https";
import { resolve } from "node:path";

import { log } from "./log.js";

/**
 * Get manifest (array of NW release metadata) from URL
 *
 * @param  {string}                       manifestUrl  Url to manifest
 * @return {Promise <object | undefined>}
 */
function getManifest(manifestUrl) {
  let chunks = undefined;

  return new Promise((resolve) => {
    const req = get(manifestUrl, (res) => {
      res.on("data", (chunk) => {
        chunks += chunk;
      });

      res.on("error", (e) => {
        log.error(e);
        resolve(undefined);
      });

      res.on("end", () => {
        log.debug("Succesfully cached manifest metadata");
        resolve(chunks);
      });
    });
    req.on("error", (e) => {
      log.warn(e);
      resolve(undefined);
    });
  });
}

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} platform     NW platform
 * @param  {string} arch         NW architecture
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */
export async function getReleaseInfo(
  version,
  platform,
  arch,
  cacheDir,
  manifestUrl
) {
  let releaseData = undefined;
  let manifestPath = undefined;
  if (platform === "osx" && arch === "arm64") {
    manifestPath = resolve(cacheDir, "manifest.mac.arm.json");
  } else {
    manifestPath = resolve(cacheDir, "manifest.json");
  }

  try {
    const data = await getManifest(manifestUrl);
    if (data !== undefined) {
      await writeFile(manifestPath, data.slice(9));
    }

    let manifest = JSON.parse(await readFile(manifestPath));
    if (version === "latest" || version === "stable" || version === "lts") {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`
    );
  } catch (e) {
    log.debug(
      "The version manifest does not exist/was not downloaded. Please try again in some time."
    );
  }
  return releaseData;
}
