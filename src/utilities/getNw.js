import fs from "fs";
import https from "https";

import progress from "cli-progress";

import getCacheDir from "./getCacheDir";
import getNwId from "./getNwId";

const getNw = async (mirror, version, flavor, os, arch) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const nwId = getNwId(version, flavor, os, arch);
  const nwUrl = `${mirror}/v${version}/${nwId}`;
  const cacheDir = getCacheDir(version, flavor, os, arch);

  https.get(nwUrl, (res) => {
    let chunks = 0;
    bar.start(res.headers["content-length"], 0);

    res.on("data", (chunk) => {
      chunks += chunk.length;
      bar.increment();
      bar.update(chunks);
    });

    res.on("end", () => {
      bar.stop();
    });

    fs.mkdirSync(cacheDir, { recursive: true });
    const stream = fs.createWriteStream(`${cacheDir}/${nwId}`);
    res.pipe(stream);
  });
};

export default getNw;
