import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import request from './request.js';

import util from '../util.js';

console.log(await verify('https://dl.nwjs.io/v0.90.0/SHASUMS256.txt', './node_modules/nw/shasum/0.90.0.txt', './node_modules/nw/nwjs-sdk-v0.90.0-linux-x64.tar.gz'));

export default async function verify(shaUrl, shaOut, filePath) {
  const shaOutExists = await util.fileExists(shaOut);

  if (shaOutExists === false) {
    /* Create directory if does not exist. */
    await fs.promises.mkdir(path.dirname(shaOut), { recursive: true });

    /* Download SHASUM text file. */
    await request(shaUrl, shaOut);
  }

  const shasum = await fs.promises.readFile(shaOut, { encoding: 'utf-8' });
  const shasumLines = shasum.split('\n');
  for (const line of shasumLines) {
    const [sha, file] = line.split('  ');
    if (file === path.basename(filePath)) {
      const fileBuffer = await fs.promises.readFile(filePath);
      const hash = crypto.createHash('sha256');
      hash.update(fileBuffer);
      const fileShasum = hash.digest('hex');
      return sha === fileShasum;
    }
  }

  return false;
}
