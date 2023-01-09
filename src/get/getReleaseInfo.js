import { access, readFile, writeFile } from "node:fs/promises";

import { log } from "../log.js";

import { getManifest } from "./getManifest.js";

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */
export const getReleaseInfo = async (version, cacheDir, manifestUrl) => {
  let releaseData = undefined;
  try {
    await access(`${cacheDir}/manifest.json`);
    log.debug(`Manifest file already exists locally under ${cacheDir}`);
  } catch (e) {
    log.debug(`Manifest file does not exist locally`);
    log.debug(`Downloading latest manifest file under ${cacheDir}`);
    const data = await getManifest(manifestUrl);
    await writeFile(`${cacheDir}/manifest.json`, data.slice(9));
  } finally {
    log.debug("Store manifest metadata in memory");
    let manifest = JSON.parse(await readFile(`${cacheDir}/manifest.json`));
    log.debug(`Search for ${version} specific release data`);
    if (version === "latest" || version === "stable" || version === "lts") {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`,
    );

    releaseData.version = version;
  }
  return releaseData;
};
