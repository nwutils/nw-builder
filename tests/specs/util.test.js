import { describe, expect, it } from 'vitest';

import util from '../../src/util.js';

describe('util/log', function () {

  it('shows only error message if log level is error', async function () {
    expect(util.log('error', 'error', 'Lorem ipsum')).toBe('[ ERROR ] Lorem ipsum');
  });

  it('shows only error message if log level is debug', async function () {
    expect(util.log('debug', 'error', 'Lorem ipsum')).toBe('');
  });

  it('throws error if message severity is invalid', async function () {
    expect(() => util.log('debuggy', 'error', 'Lorem ipsum')).toThrow();
  });

  it('throws error if user defined log level is invalid', async function () {
    expect(() => util.log('debug', 'errory', 'Lorem ipsum')).toThrow();
  });

});

describe('util/validate', function () {

  it('throws error on invalid mode', async function () {
    await expect(util.validate({ mode: 'gety' }, {})).rejects.toThrow(Error);
  });

  it('throws error if releases info is undefined', async function () {
    await expect(util.validate({ mode: 'get' }, undefined)).rejects.toThrow(Error);
  });

  it('throws error on invalid flavor', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'notsdk' }, { flavours: ['normal'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid platform', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linox' }, { flavours: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid architecture', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64000' }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid download url', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64', downloadUrl: null }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid manifest url', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64', downloadUrl: 'file://path/to/fs', manifestUrl: null }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid cache directory', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64', downloadUrl: 'file://path/to/fs', manifestUrl: 'http://path/to/manifest', cacheDir: null }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid cache flag', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64', downloadUrl: 'file://path/to/fs', manifestUrl: 'http://path/to/manifest', cacheDir: './path/to/cache', cache: 'true' }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

  it('throws error on invalid ffmpeg flag', async function () {
    await expect(util.validate({ mode: 'get', flavor: 'normal', platform: 'linux', arch: 'x64', downloadUrl: 'file://path/to/fs', manifestUrl: 'http://path/to/manifest', cacheDir: './path/to/cache', cache: true, ffmpeg: 'true' }, { flavors: ['normal'], files: ['linux-x64'] })).rejects.toThrow(Error);
  });

});

describe('util/parse', function () {
  // It is the job of the respective `set<platformName>Config` to resolve the app.icon path
  it('doesnt resolve app.icon', async function () {
    const newOptions = await util.parse({ app: { icon: '.' } }, {});
    expect(newOptions.app.icon).toBe('.');
  });
});
