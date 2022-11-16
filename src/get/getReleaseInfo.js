import fs from "node:fs/promises";

import { getManifest } from "./getManifest.js";

export const getReleaseInfo = async (version, cacheDir, manifestUrl) => {
    let releaseData = undefined;
    try {
        await fs.access(`${cacheDir}/manifest.json`);
        console.log(`[ INFO ] Manifest file already exists locally under ${cacheDir}`)
    } catch(e) {
        console.log(`[ ERROR ] Manifest file does not exist locally`);
        console.log(`[ INFO ] Downloading latest manifest file under ${cacheDir}`);
        const data = await getManifest(manifestUrl);
    await fs.writeFile(`${cacheDir}/manifest.json`, data.slice(9));
    } finally {
        let manifestData = await fs.readFile(`${cacheDir}/manifest.json`);
        let manifestJson = JSON.parse(manifestData);
        releaseData = manifestJson.versions.find(release => release.version === `v${version}`);
    }
    return releaseData;
};