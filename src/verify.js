import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import request from "./request.js";

/**
 * Verify the SHA256 checksum of downloaded artifacts.
 * @async
 * @function
 * @param {string} shaUrl - URL to get the shasum text file from.
 * @param {string} shaOut - File path to shasum text file.
 * @param {string} cacheDir - File path to cache directory.
 * @param {boolean} ffmpeg - Toggle between community (true) and official (false) ffmpeg binary
 * @param {boolean} shaSum - Throws error if true, otherwise logs a warning. Applies to both a checksum mismatch and `expectedFile` never being checked at all.
 * @param {string} [expectedFile] - Relative path, as listed in the SHASUMS file, that this call is actually relying on being verified. Other listed files that don't exist locally (eg. other platforms) are still skipped silently - only `expectedFile` going unchecked is treated as a failure, since that means the caller's "integrity verified" belief was never actually true.
 * @throws {Error}
 * @returns {Promise<boolean>} - Returns true if the checksums match.
 */
export default async function verify(
  shaUrl,
  shaOut,
  cacheDir,
  ffmpeg,
  shaSum,
  expectedFile,
) {
  const shaOutExists = fs.existsSync(shaOut);

  if (shaOutExists === false) {
    /* Create directory if does not exist. */
    await fs.promises.mkdir(path.dirname(shaOut), { recursive: true });

    /* Download SHASUM text file. */
    await request(shaUrl, shaOut);
  }

  /* Read SHASUM text file */
  const shasum = await fs.promises.readFile(shaOut, { encoding: "utf-8" });
  const shasums = shasum.trim().split("\n");
  let expectedFileWasChecked = false;

  for await (const line of shasums) {
    const [storedSha, filePath] = line.split(/\s+/);
    const relativeFilePath = path.resolve(cacheDir, filePath);
    const relativefilePathExists = fs.existsSync(relativeFilePath);
    if (relativefilePathExists) {
      if (filePath === expectedFile) {
        expectedFileWasChecked = true;
      }

      const fileBuffer = await fs.promises.readFile(relativeFilePath);
      const hash = crypto.createHash("sha256");
      hash.update(fileBuffer);
      const generatedSha = hash.digest("hex");
      if (
        !crypto.timingSafeEqual(
          Buffer.from(generatedSha, "hex"),
          Buffer.from(storedSha, "hex"),
        )
      ) {
        if (filePath.includes("ffmpeg") && ffmpeg) {
          console.warn(
            `The generated shasum for the community ffmpeg at ${filePath} is ${generatedSha}. The integrity of this file should be manually verified.`,
          );
        } else {
          const message = `SHA256 checksums do not match. The file ${filePath} expected shasum is ${storedSha} but the actual shasum is ${generatedSha}.`;
          if (shaSum) {
            throw new Error(message);
          } else {
            console.log(message);
          }
        }
      }
    }
  }

  /*
   * Most of `expectedFile` unchecked would mean nothing was actually
   * verified - eg. a naming mismatch, or the entry missing from the SHASUMS
   * file - while every other unmatched line above is legitimately silent
   * (other platforms/flavors listed in the same file).
   */
  if (expectedFile && !expectedFileWasChecked) {
    const message = `Expected a checksum entry for ${JSON.stringify(expectedFile)} in ${JSON.stringify(shaOut)}, but it was not found or does not exist locally - the archive's integrity was not actually checked.`;
    if (shaSum) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  return true;
}
