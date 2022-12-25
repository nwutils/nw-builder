import fs from "node:fs";
import https from "node:https";

import progress from "cli-progress";

const bar = new progress.SingleBar({}, progress.Presets.rect);

const download = (
  version,
  flavor,
  platform,
  architecture,
  downloadUrl,
  outDir,
) => {
  return new Promise((resolve, reject) => {
    if (downloadUrl !== "https://dl.nwjs.io") {
      reject(new Error("Invalid download url. Please try again."));
    }

    let url = `${downloadUrl}/v${version}/nwjs${
      flavor === "sdk" ? "-sdk" : ""
    }-v${version}-${platform}-${architecture}.${
      platform === "linux" ? "tar.gz" : "zip"
    }`;

    https.get(url, (res) => {
      let chunks = 0;
      bar.start(Number(res.headers["content-length"]), 0);

      res.on("data", (chunk) => {
        chunks += chunk.length;
        bar.increment();
        bar.update(chunks);
      });

      res.on("error", (error) => {
        reject(error);
      });

      res.on("end", () => {
        bar.stop();
        resolve();
      });

      fs.mkdirSync(outDir, { recursive: true });
      const stream = fs.createWriteStream(
        `${outDir}/nw.${platform === "linux" ? "tar.gz" : "zip"}`,
      );
      res.pipe(stream);
    });
  });
};

export { download };
