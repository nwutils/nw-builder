import process from 'node:process';

import { beforeAll, describe, expect, it } from 'vitest';

import get from '../../src/get/index.js';
import run from '../../src/run.js';
import util from '../../src/util.js';

describe('run test suite', async () => {

  const nwOptions = {
    srcDir: 'tests/fixtures/app',
    mode: 'build',
    version: '0.93.0',
    flavor: 'sdk',
    platform: util.PLATFORM_KV[process.platform],
    arch: util.ARCH_KV[process.arch],
    downloadUrl: 'https://dl.nwjs.io',
    manifestUrl: 'https://nwjs.io/versions',
    outDir: 'tests/fixtures/out/app',
    cacheDir: './node_modules/nw',
    cache: true,
    ffmpeg: false,
    glob: false,
    managedManifest: false,
    nativeAddon: false,
    zip: false
  };

  beforeAll(async () => {
    await get(nwOptions);
  }, Infinity);

  it.skipIf(process.platform === 'win32')('runs and is killed via code', async () => {
    const nwProcess = await run(nwOptions);
    if (nwProcess) {
      nwProcess.kill();
      expect(nwProcess.killed).toEqual(true);
    }
  });
});
