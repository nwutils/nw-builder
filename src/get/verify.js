import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import request from './request.js';

import util from '../util.js';

/**
 * Verify the SHA256 checksum of downloaded artifacts.
 *
 * @param {string} shaUrl - URL to get the shasum text file from.
 * @param {string} shaOut - File path to shasum text file.
 * @param {string} cacheDir - File path to cache directory.
 * @throws {Error}
 * @returns {Promise<boolean>}
 */
export default async function verify(shaUrl, shaOut, cacheDir) {
  const shaOutExists = await util.fileExists(shaOut);

  if (shaOutExists === false) {
    /* Create directory if does not exist. */
    await fs.promises.mkdir(path.dirname(shaOut), { recursive: true });

    /* Download SHASUM text file. */
    await request(shaUrl, shaOut);
  }

  /* Read SHASUM text file */
  const shasum = await fs.promises.readFile(shaOut, { encoding: 'utf-8' });
  const shasums = shasum.trim().split('\n');
  for await (const line of shasums) {
    const [storedSha, filePath] = line.split('  ');
    const relativeFilePath = path.resolve(cacheDir, filePath);
    const relativefilePathExists = await util.fileExists(relativeFilePath);
    if (relativefilePathExists) {
      const fileBuffer = await fs.promises.readFile(relativeFilePath);
      const hash = crypto.createHash('sha256');
      hash.update(fileBuffer);
      const generatedSha = hash.digest('hex');
      if (storedSha !== generatedSha) {
        throw new Error('SHA256 checksums do not match.');
      }
    }
  }

  return true;
}
