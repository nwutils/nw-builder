import fs from "node:fs";

const remove = (platform, outDir) => {
  return new Promise((resolve, reject) => {
    fs.rm(
      `${outDir}/nw.${platform === "linux" ? "tar.gz" : "zip"}`,
      (error) => {
        if (error) {
          reject(error);
        }
      },
    );
    resolve(0);
  });
};

export { remove };
