import path from "node:path";

import extract from "extract-zip";
import tar from "tar";

const decompress = (platform, outDir) => {
  return new Promise((resolve, reject) => {
    if (platform === "linux") {
      tar
        .x({
          file: `${outDir}/nw.tar.gz`,
          C: `${outDir}`,
        })
        .then(() => {
          resolve(0);
        })
        .catch(() => {
          reject(1);
        });
    } else {
      extract(path.resolve(`${outDir}/nw.zip`), {
        dir: path.resolve(`${outDir}`),
      })
        .then(() => {
          resolve(0);
        })
        .catch(() => {
          reject(1);
        });
    }
  });
};

export { decompress };
