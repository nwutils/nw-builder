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
  const src = resolve(nwDir, ffmpegFile)
  if (platform === "linux") {
    const dest = resolve(nwDir, "lib", ffmpegFile)
    await copyFile(src, dest);
  } else if (platform === "win") {
    // don't do anything for windows because the extracted file is already in the correct path
    // await copyFile(src, resolve(nwDir, ffmpegFile));
  } else if (platform === "osx") {
    const dest = resolve(
        nwDir,
        "nwjs.app",
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
        ffmpegFile
      );

      await copyFile(src, dest);
  }
};
