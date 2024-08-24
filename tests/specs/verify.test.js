import { describe, expect, it } from 'vitest';

import verify from '../../src/get/verify.js';

import nodeManifest from '../../package.json';

describe('get/verify', function () {

  it('verify shasums', async function () {
    const status = await verify(
      `https://dl.nwjs.io/v${nodeManifest.devDependencies.nw.split('^')[1]}/SHASUMS256.txt`,
      `./node_modules/nw/shasum/${nodeManifest.devDependencies.nw.split('^')[1]}.txt`,
      './node_modules/nw'
    );
    expect(status).toBe(true);
  }, Infinity);
});
