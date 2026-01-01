import fs from 'node:fs';
import path from 'node:path';

import * as nw from 'nw';
import plist from 'plist';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import setOsxConfig from '../../src/bld/osx.js';
import util from '../../src/util.js';

import nodeManifest from '../../package.json';

describe('bld/setOsxConfig', async function () {

  const outDir = './tests/fixtures/macos';
  const appPath = path.join(outDir, 'Demo.app');
  const releaseInfo = await util.getReleaseInfo(
    nodeManifest.devDependencies.nw.split('^')[1],
    util.PLATFORM_KV['darwin'],
    util.ARCH_KV['arm64'],
    './node_modules/nw',
    'https://nwjs.io/versions.json',
  );
  const chromiumVersion = releaseInfo.components.chromium;
  const helperAlertsPath = path.join(appPath,
    'Contents',
    'Frameworks',
    'nwjs Framework.framework',
    'Versions',
    chromiumVersion,
    'Helpers',
    'Demo Helper (Alerts).app');
  const helperGPUPath = path.join(appPath,
    'Contents',
    'Frameworks',
    'nwjs Framework.framework',
    'Versions',
    chromiumVersion,
    'Helpers',
    'Demo Helper (GPU).app');
  const helperPluginPath = path.join(appPath,
    'Contents',
    'Frameworks',
    'nwjs Framework.framework',
    'Versions',
    chromiumVersion,
    'Helpers',
    'Demo Helper (Plugin).app');
  const helperRendererPath = path.join(appPath,
    'Contents',
    'Frameworks',
    'nwjs Framework.framework',
    'Versions',
    chromiumVersion,
    'Helpers',
    'Demo Helper (Renderer).app');
  const helperPath = path.join(appPath,
    'Contents',
    'Frameworks',
    'nwjs Framework.framework',
    'Versions',
    chromiumVersion,
    'Helpers',
    'Demo Helper.app');

  beforeAll(async function () {
    /* Copy the cached NW.js into a specific `outDir`. */
    const nwDir = await nw.findpath('all', { flavor: 'sdk' });
    await fs.promises.cp(nwDir, outDir, { recursive: true, force: true });

    /* Rename relevant bundles' plists and executables. */
    await setOsxConfig({
      app: {
        name: 'Demo',
        LSApplicationCategoryType: 'public.app-category.utilities',
        CFBundleIdentifier: 'io.nwutils.demo',
        CFBundleName: 'Demo',
        CFBundleDisplayName: 'Demo',
        CFBundleSpokenName: 'Demo',
        CFBundleVersion: '0.0.0',
        CFBundleShortVersionString: '0.0.0',
        NSHumanReadableCopyright: 'Copyright (c) 2024 NW.js Utilities',
        NSLocalNetworkUsageDescription: 'This test application needs to access the local network for testing purposes.'
      },
      outDir: outDir,
      releaseInfo: {
        components: {
          chromium: chromiumVersion,
        }
      },
    });
  });

  it('renames the .app files correctly', async function () {
    const appPathExists = await util.fileExists(appPath);
    expect(appPathExists).toEqual(true);

    const helperAlertsPathExists = await util.fileExists(helperAlertsPath);
    expect(helperAlertsPathExists).toEqual(true);

    const helperGPUPathExists = await util.fileExists(helperGPUPath);
    expect(helperGPUPathExists).toEqual(true);

    const helperPluginPathExists = await util.fileExists(helperPluginPath);
    expect(helperPluginPathExists).toEqual(true);

    const helperRendererPathExists = await util.fileExists(helperRendererPath);
    expect(helperRendererPathExists).toEqual(true);

    const helperPathExists = await util.fileExists(helperPath);
    expect(helperPathExists).toEqual(true);
  });

  it('renames the executables correctly', async function () {
    const appExePath = path.join(appPath, 'Contents', 'MacOS', 'Demo');
    const appExePathExists = await util.fileExists(appExePath);
    expect(appExePathExists).toEqual(true);

    const helperAlertsExePath = path.join(helperAlertsPath, 'Contents', 'MacOS', 'Demo Helper (Alerts)');
    const helperAlertsExePathExists = await util.fileExists(helperAlertsExePath);
    expect(helperAlertsExePathExists).toEqual(true);

    const helperGPUExePath = path.join(helperGPUPath, 'Contents', 'MacOS', 'Demo Helper (GPU)');
    const helperGPUExePathExists = await util.fileExists(helperGPUExePath);
    expect(helperGPUExePathExists).toEqual(true);

    const helperPluginExePath = path.join(helperPluginPath, 'Contents', 'MacOS', 'Demo Helper (Plugin)');
    const helperPluginExePathExists = await util.fileExists(helperPluginExePath);
    expect(helperPluginExePathExists).toEqual(true);

    const helperRendererExePath = path.join(helperRendererPath, 'Contents', 'MacOS', 'Demo Helper (Renderer)');
    const helperRendererExePathExists = await util.fileExists(helperRendererExePath);
    expect(helperRendererExePathExists).toEqual(true);

    const helperExePath = path.join(helperPath, 'Contents', 'MacOS', 'Demo Helper');
    const helperExePathExists = await util.fileExists(helperExePath);
    expect(helperExePathExists).toEqual(true);
  });

  it('', async function () {
    const ContentsInfoPlistPath = path.resolve(
      appPath,
      'Contents',
      'Info.plist'
    );
    const ContentsInfoPlistJson = plist.parse(
      await fs.promises.readFile(
        ContentsInfoPlistPath,
        'utf-8'
      )
    );
    expect(ContentsInfoPlistJson.LSApplicationCategoryType).toEqual('public.app-category.utilities');
    expect(ContentsInfoPlistJson.CFBundleIdentifier).toEqual('io.nwutils.demo');
    expect(ContentsInfoPlistJson.CFBundleName).toEqual('Demo');
    expect(ContentsInfoPlistJson.CFBundleDisplayName).toEqual('Demo');
    expect(ContentsInfoPlistJson.CFBundleSpokenName).toEqual('Demo');
    expect(ContentsInfoPlistJson.CFBundleVersion).toEqual('0.0.0');
    expect(ContentsInfoPlistJson.CFBundleShortVersionString).toEqual('0.0.0');
    expect(ContentsInfoPlistJson.CFBundleExecutable).toEqual('Demo');
    expect(ContentsInfoPlistJson.NSLocalNetworkUsageDescription).toEqual('This test application needs to access the local network for testing purposes.');

    const HelperAlertsAppJson = plist.parse(
      await fs.promises.readFile(
        path.resolve(
          helperAlertsPath,
          'Contents',
          'Info.plist'
        ),
        'utf-8'
      )
    );

    expect(HelperAlertsAppJson.CFBundleDisplayName).toEqual('Demo Helper (Alerts)');
    expect(HelperAlertsAppJson.CFBundleName).toEqual('Demo Helper (Alerts)');
    expect(HelperAlertsAppJson.CFBundleIdentifier).toEqual('io.nwutils.demo.helper.alert');
    expect(HelperAlertsAppJson.CFBundleExecutable).toEqual('Demo Helper (Alerts)');

    const HelperGpuAppJson = plist.parse(
      await fs.promises.readFile(
        path.resolve(
          helperGPUPath,
          'Contents',
          'Info.plist'
        ),
        'utf-8'
      )
    );

    expect(HelperGpuAppJson.CFBundleDisplayName).toEqual('Demo Helper (GPU)');
    expect(HelperGpuAppJson.CFBundleName).toEqual('Demo Helper (GPU)');
    expect(HelperGpuAppJson.CFBundleIdentifier).toEqual('io.nwutils.demo.helper.gpu');
    expect(HelperGpuAppJson.CFBundleExecutable).toEqual('Demo Helper (GPU)');

    const HelperPluginAppJson = plist.parse(
      await fs.promises.readFile(
        path.resolve(
          helperPluginPath,
          'Contents',
          'Info.plist'
        ),
        'utf-8'
      )
    );

    expect(HelperPluginAppJson.CFBundleDisplayName).toEqual('Demo Helper (Plugin)');
    expect(HelperPluginAppJson.CFBundleName).toEqual('Demo Helper (Plugin)');
    expect(HelperPluginAppJson.CFBundleIdentifier).toEqual('io.nwutils.demo.helper.plugin');
    expect(HelperPluginAppJson.CFBundleExecutable).toEqual('Demo Helper (Plugin)');

    const HelperRendererAppJson = plist.parse(
      await fs.promises.readFile(
        path.resolve(
          helperRendererPath,
          'Contents',
          'Info.plist'
        ),
        'utf-8'
      )
    );

    expect(HelperRendererAppJson.CFBundleDisplayName).toEqual('Demo Helper (Renderer)');
    expect(HelperRendererAppJson.CFBundleName).toEqual('Demo Helper (Renderer)');
    expect(HelperRendererAppJson.CFBundleIdentifier).toEqual('io.nwutils.demo.helper.renderer');
    expect(HelperRendererAppJson.CFBundleExecutable).toEqual('Demo Helper (Renderer)');

    const HelperAppJson = plist.parse(
      await fs.promises.readFile(
        path.resolve(
          helperPath,
          'Contents',
          'Info.plist'
        ),
        'utf-8'
      )
    );

    expect(HelperAppJson.CFBundleDisplayName).toEqual('Demo Helper');
    expect(HelperAppJson.CFBundleName).toEqual('Demo Helper');
    expect(HelperAppJson.CFBundleIdentifier).toEqual('io.nwutils.demo.helper');
    expect(HelperAppJson.CFBundleExecutable).toEqual('Demo Helper');

    afterAll(async function () {
      await fs.promises.rm('./tests/fixtures/macos', { recursive: true, force: true });
    });
  });
});
