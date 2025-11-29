import path from 'node:path';
import process from 'node:process';

import { By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { beforeAll, describe, expect, it } from 'vitest';

import build from '../../src/bld.js';
import get from '../../src/get/index.js';
import util from '../../src/util.js';

const { Driver, ServiceBuilder, Options } = chrome;

describe.skip('bld test suite', async () => {
  let driver = undefined;

  const nwOptions = {
    srcDir: 'tests/fixtures/app',
    mode: 'build',
    version: '0.106.0',
    flavor: 'sdk',
    platform: util.PLATFORM_KV[process.platform],
    arch: util.ARCH_KV[process.arch],
    downloadUrl: 'https://dl.nwjs.io',
    manifestUrl: 'https://nwjs.io/versions.json',
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

  it('builds without errors', async () => {
    await build(nwOptions);
  });

  it('runs after build', { timeout: Infinity }, async () => {
    const options = new Options();
    const args = [
      `--nwapp=${path.resolve('test', 'fixture', 'app')}`,
      '--headless=new',
    ];
    options.addArguments(args);

    const chromedriverPath = util.getPath('chromedriver', nwOptions);

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id('test')).getText();
    expect(text).toBe('Hello, World!');
  });

});
