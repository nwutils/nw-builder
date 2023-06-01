import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Replaces the ffmpeg file in the nwjs directory with the one provided
 *
 * @param {string} platform    The platform to replace the ffmpeg file for
 * @param {string} nwDir       The directory of the nwjs installation
 * @param {string} ffmpegFile  The path to the ffmpeg file to replace with
 */
export const replaceFfmpeg = async (platform, nwDir, ffmpegFile) => {
  if (platform === "linux") {
    await copyFile(ffmpegFile, resolve(nwDir, "lib", ffmpegFile));
  } else if (platform === "win") {
    await copyFile(ffmpegFile, resolve(nwDir, ffmpegFile));
  } else if (platform === "osx") {
    await copyFile(
      ffmpegFile,
      resolve(
        nwDir,
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
        ffmpegFile
      )
    );
  }
};
