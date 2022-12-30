import fs from "node:fs";

/**
 * Removes a zip or tar.gz file
 *
 * @param  {"win" | "osx" | "linux"} platform  The platform to remove for
 * @param  {string}                  outDir    The directory to remove from
 * @return {Promise<undefined>}                The exit code
 */
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
    resolve();
  });
};

export { remove };
