import fs from 'node:fs';
import process from 'node:process';

import { afterEach, describe, expect, it } from 'vitest';

import util from '../../src/util.js';

import ffmpeg from '../../src/get/ffmpeg.js';

describe('get/ffmpeg', function () {

  let ffmpegFile = '';

  afterEach(async function () {
    await fs.promises.rm(ffmpegFile, { recursive: true, force: true });
  });

  it('downloades community prebuild FFmpeg for specifc platform', { timeout: Infinity }, async function () {
    ffmpegFile = await ffmpeg(
      'https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download',
      '0.106.0',
      util.PLATFORM_KV[process.platform],
      util.ARCH_KV[process.arch],
      './tests/fixtures'
    );
    await expect(util.fileExists(ffmpegFile)).resolves.toBe(true);
  });
});
