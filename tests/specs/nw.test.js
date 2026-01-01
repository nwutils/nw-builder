import fs from 'node:fs';
import process from 'node:process';

import { afterEach, describe, expect, it } from 'vitest';

import util from '../../src/util.js';

import nw from '../../src/get/nw.js';

describe('get/nw', function () {

  let nwFile = '';

  afterEach(async function () {
    await fs.promises.rm(nwFile, { recursive: true, force: true });
  });

  it('downloades a NW.js Linux tarball or Windows/MacOS zip', { timeout: Infinity }, async function () {
    nwFile = await nw(
      'https://dl.nwjs.io',
      '0.83.0',
      'sdk',
      util.PLATFORM_KV[process.platform],
      util.ARCH_KV[process.arch],
      './tests/fixtures'
    );
    await expect(util.fileExists(nwFile)).resolves.toBe(true);
  });
});
