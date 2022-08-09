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
  const nwId = getNwId(version, flavour, Platform, Arch, (ext = false));
  if (!fs.existsSync(`${cacheDir}/${nwId}`)) {
    download(version, flavour, platform, arch, mirror, cacheDir);
  } else {
    execute(`${cacheDir}/${nwId}`, srcDir, platform);
  }
};

export default run;
