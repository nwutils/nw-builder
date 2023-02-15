import { resolve } from "node:path";

import extract from "extract-zip";
import tar from "tar";

const decompress = (platform, outDir) => {
  return new Promise((res, rej) => {
    if (platform === "linux") {
      tar
        .x({
          file: resolve(outDir, "nw.tar.gz"),
          C: resolve(outDir),
        })
        .then(() => {
          res();
        })
        .catch((error) => {
          rej(error);
        });
    } else {
      extract(resolve(outDir, "nw.zip"), {
        dir: resolve(outDir),
      })
        .then(() => {
          res();
        })
        .catch((error) => {
          rej(error);
        });
    }
  });
};

export { decompress };
