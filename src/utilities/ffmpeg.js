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
  const src = resolve(nwDir, ffmpegFile);
  if (platform === "linux") {
    const dest = resolve(nwDir, "lib", ffmpegFile);
    await copyFile(src, dest);
  } else if (platform === "win") {
    // don't do anything for windows because the extracted file is already in the correct path
    // await copyFile(src, resolve(nwDir, ffmpegFile));
  } else if (platform === "osx") {
    let dest = resolve(
      nwDir,
      "nwjs.app",
      "Contents",
      "Frameworks",
      "nwjs Framework.framework",
      "Versions",
      "Current",
      ffmpegFile,
    );

    try {
      await copyFile(src, dest);
    } catch (e) {
      //some versions of node/macOS complain about destination being a file, and others complain when it is only a directory.
      //the only thing I can think to do is to try both
      dest = resolve(
        nwDir,
        "nwjs.app",
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
      );
      await copyFile(src, dest);
    }
  }
};
