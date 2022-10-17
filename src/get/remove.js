import fs from "node:fs";

/**
 *
 * @param platform
 * @param outDir
 */
const remove = (platform, outDir) => {
  return new Promise((resolve, reject) => {
    fs.rm(
      `${outDir}/nw.${platform === "linux" ? "tar.gz" : "zip"}`,
      (error) => {
        if (error) {
          reject(1);
        }
      },
    );
    resolve(0);
  });
};

export { remove };
