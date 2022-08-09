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
    let d = await download(version, flavour, platform, arch, mirror, cacheDir);
    if (d === 0) {
      let u = await unzip(version, flavour, platform, arch, cacheDir);

      if (u === 0) {
        let e = await execute(`${cacheDir}/${nwId}`, srcDir, platform);

        if (e == 0) {
          return 0;
        }
      }
    }
  } else {
    let e = execute(`${cacheDir}/${nwId}`, srcDir, platform);
    if (e === 0) {
      return 0;
    }
  }
};

export default run;
