import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import request from './request.js';

import util from '../util.js';

console.log(await verify('0.90.0', 'sdk', 'linux', 'x64', './node_modules/nw'));

export default async function verify(version, flavor, platform, arch, cacheDir) {
  const shaUrl = `https://dl.nwjs.io/v${version}/SHASUMS256.txt`;
  const shaOut = path.resolve(cacheDir, 'shasum', `${version}.txt`);
  const shaOutExists = await util.fileExists(shaOut);
  let nwFilePath = path.resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}.${platform === "linux" ? "tar.gz" : "zip"
    }`,
  );

  /* Create directory if does not exist. */
  if (shaOutExists === false) {
    await fs.promises.mkdir(path.dirname(shaOut), { recursive: true });
  }

  /* Download SHASUM text file. */
  await request(shaUrl, shaOut);

  const shasum = await fs.promises.readFile(shaOut, { encoding: 'utf-8' });
  const shasumLines = shasum.split('\n');
  for (const line of shasumLines) {
    const [sha, file] = line.split('  ');
    const filePath = path.resolve(cacheDir, nwFilePath);
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
