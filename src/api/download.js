import fs from "node:fs";
import https from "node:https";

import progress from "cli-progress";

import unzip from "./unzip";

import getNwId from "../utilities/getNwId";
import getArch from "../utilities/getArch";
import getPlatform from "../utilities/getPlatform";

const download = async (version, flavour, platform, arch, mirror, outDir) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);

  let Platform = getPlatform(platform);
  let Arch = getArch(arch);

  const nwId = getNwId(version, flavour, Platform, Arch);

  https.get(`${mirror}/v${version}/${nwId}`, (res) => {
    let chunks = 0;
    bar.start(res.headers["content-length"], 0);

    res.on("data", (chunk) => {
      chunks += chunk.length;
      bar.increment();
      bar.update(chunks);
    });

    res.on("end", () => {
      bar.stop();
      unzip(version, flavour, platform, arch, outDir);
    });

    fs.mkdirSync(outDir, { recursive: true });
    const stream = fs.createWriteStream(`${outDir}/${nwId}`);
    res.pipe(stream);
  });
};

export default download;
