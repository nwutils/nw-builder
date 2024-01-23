import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { beforeAll, describe, it } from "vitest";

import get from '../../src/get.js';

describe("get", async () => {
  const nwOptions = {
    version: "0.83.0",
    flavor: "sdk",
    platform: "osx",
    arch: "x64",
    downloadUrl: "https://dl.nwjs.io",
    cacheDir: "test/fixture/cache",
    cache: true,
    ffmpeg: false,
    nativeAddon: false,
  };
    
  beforeAll(async () => {
    await get({...nwOptions});
  }, Infinity);

  it("downloads macos binary", async function () {
    assert.strictEqual(fs.existsSync(path.resolve(process.cwd(), nwOptions.cacheDir, `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${nwOptions.platform}-${nwOptions.arch}`, "nwjs.app")), true);
  });

  it("preserves symlinks on macos build", async function () {
    const frameworksPath = path.resolve(process.cwd(), nwOptions.cacheDir, `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${nwOptions.platform}-${nwOptions.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
    const symlinks = [
      path.join(frameworksPath, "Helpers"),
      path.join(frameworksPath, "Libraries"),
      path.join(frameworksPath, "nwjs Framework"),
      path.join(frameworksPath, "Resources"),
      path.join(frameworksPath, "Versions", "Current"),
    ];

    for (const symlink of symlinks) {
      const stats = await fs.promises.lstat(symlink);
      assert.strictEqual(stats.isSymbolicLink(), true);
    }
  });
});
