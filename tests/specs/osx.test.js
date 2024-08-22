import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import * as nw from 'nw';
import plist from 'plist';
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import setOsxConfig from "../../src/bld/osx.js";
import util from "../../src/util.js";

describe
// .runIf(process.platform === 'darwin')
("bld/setOsxConfig", async function () {

  const outDir = './tests/fixtures/macos';

  beforeAll(async function () {
    /* Copy the cached NW.js into a specific `outDir`. */
    const nwDir = await nw.findpath('all', { flavor: 'sdk' })
    await fs.promises.cp(nwDir, outDir, { recursive: true, force: true });

    /* Rename relevant bundles' plists and executables. */
    await setOsxConfig({
      app: {
        name: 'nwapp',
        LSApplicationCategoryType: 'public.app-category.utilities',
        CFBundleIdentifier: 'io.nwutils.demo',
        CFBundleName: 'Demo',
        CFBundleDisplayName: 'Demo',
        CFBundleSpokenName: 'Demo',
        CFBundleVersion: '0.0.0',
        CFBundleShortVersionString: '0.0.0',
        NSHumanReadableCopyright: 'Copyright (c) 2024 NW.js Utilities'
      },
      outDir: outDir,
      releaseInfo: { components: {
        chromium: "127.0.6533.73",
      }},
    });
  });

  it("renames the apps and executables correctly", async function () {
    const appPath = path.join(outDir, 'nwapp.app');
    const appPathExists = await util.fileExists(appPath);
    expect(appPathExists).toEqual(true);
  });

  it("", async function () {
    // verify if bundle's plist values are renamed properly
  });

  afterAll(async function () {
    await fs.promises.rm('./tests/fixtures/macos', { recursive: true, force: true });
  });
});
