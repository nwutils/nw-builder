import fs from "node:fs";

import getNwId from "../utilities/getNwId";
import getArch from "../utilities/getArch";
import getPlatform from "../utilities/getPlatform";

import download from "./download";
import execute from "./execute";
import unzip from "./unzip";

const run = async (
  version,
  flavour,
  platform,
  arch,
  mirror,
  srcDir,
  cacheDir,
) => {
  let Platform = getPlatform(platform);
  let Arch = getArch(arch);
  const nwId = getNwId(version, flavour, Platform, Arch, ext = false);
  const isDownloaded = fs.existsSync(`${cacheDir}/${nwId}`);
  if (isDownloaded) {
    await download(version, flavour, platform, arch, mirror, cacheDir);
    await unzip(version, flavour, platform, arch, cacheDir);
    await execute(`${cacheDir}/${nwId}`, srcDir, platform);
  } else {
    await execute(`${cacheDir}/${nwId}`, srcDir, platform);
  }
};

export default run;
