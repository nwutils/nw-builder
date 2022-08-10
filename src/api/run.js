import fs from "node:fs";

import getNwId from "../utilities/getNwId";
import getArch from "../utilities/getArch";
import getPlatform from "../utilities/getPlatform";

import download from "./download";
import execute from "./execute";
import unzip from "./unzip";

const run = (version, flavour, platform, arch, mirror, srcDir, cacheDir) => {
  let Platform = getPlatform(platform);
  let Arch = getArch(arch);
  const nwId = getNwId(version, flavour, Platform, Arch, (ext = false));
  const isDownloaded = fs.existsSync(`${cacheDir}/${nwId}`);
  if (!isDownloaded) {
    download(version, flavour, platform, arch, mirror, cacheDir)
      .then(() => {
        unzip(version, flavour, platform, arch, cacheDir);
      })
      .then(() => {
        // execute(`${cacheDir}/${nwId}`, srcDir, platform);
      });
  } else {
    // execute(`${cacheDir}/${nwId}`, srcDir, platform);
  }
};

export default run;
