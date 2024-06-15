import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import * as nw from "nw";
import { beforeAll, describe, expect, it } from "vitest";

import decompress from "./decompress.js";

describe("get/decompress", async function () {

  let nwFilePath = '';
  let nwDirPath = '';
  let nwOutPath = "./test/fixture/cache/nw";

  beforeAll(async function () {
    nwDirPath = await nw.findpath('nwjs', { flavor: 'sdk' });

    if (process.platform === 'linux') {
      nwFilePath = nwDirPath + '.tar.gz';
    } else {
      nwFilePath = nwDirPath + '.zip';
    }
  });

  it("decompresses a NW.js binary", async function () {
    expect(await decompress(nwFilePath, nwOutPath)).not.toThrowError();;
  });

  it.runIf(process.platform === 'darwin')("preserves symlinks on macos", async function () {
    const frameworksPath = path.resolve(process.cwd(), nwOutPath, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
    const symlinks = [
      path.join(frameworksPath, "Helpers"),
      path.join(frameworksPath, "Libraries"),
      path.join(frameworksPath, "nwjs Framework"),
      path.join(frameworksPath, "Resources"),
      path.join(frameworksPath, "Versions", "Current"),
    ];

    for (const symlink of symlinks) {
      const stats = await fs.promises.lstat(symlink);
      expect(stats.isSymbolicLink()).toEqual(true);
    }
  });
});
