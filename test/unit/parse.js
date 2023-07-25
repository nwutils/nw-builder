import { deepStrictEqual } from "node:assert";
import { arch, platform } from "node:process";
import { describe, it } from "node:test";

import { parse } from "../../src/util/parse.js";
import { getArch } from "../../src/util/arch.js";
import { getPlatform } from "../../src/util/platform.js";

describe("parse - get mode", () => {
  it("default values", async () => {
    const actualOptions = await parse({
      mode: "get",
    });

    const expectedOptions = {
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: getPlatform(platform),
      arch: getArch(arch),
      cacheDir: "./cache",
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions",
      cache: true,
      ffmpeg: false,
      logLevel: "info",
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });

  it("unofficial macos arm", async () => {
    const actualOptions = await parse({
      mode: "get",
      platform: "osx",
      arch: "arm64",
      downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
      manifestUrl:
        "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
    });

    const expectedOptions = {
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: "osx",
      arch: "arm64",
      cacheDir: "./cache",
      downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
      manifestUrl:
        "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
      cache: true,
      ffmpeg: false,
      logLevel: "info",
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });

  it("china mirror", async () => {
    const actualOptions = await parse({
      mode: "get",
      downloadUrl: "https://npm.taobao.org/mirrors/nwjs/",
    });

    const expectedOptions = {
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: getPlatform(platform),
      arch: getArch(arch),
      cacheDir: "./cache",
      downloadUrl: "https://npm.taobao.org/mirrors/nwjs/",
      manifestUrl: "https://nwjs.io/versions",
      cache: true,
      ffmpeg: false,
      logLevel: "info",
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });

  it("singapore mirror", async () => {
    const actualOptions = await parse({
      mode: "get",
      downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
    });

    const expectedOptions = {
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: getPlatform(platform),
      arch: getArch(arch),
      cacheDir: "./cache",
      downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
      manifestUrl: "https://nwjs.io/versions",
      cache: true,
      ffmpeg: false,
      logLevel: "info",
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });

  it("prebuilt ffmpeg", async () => {
    const actualOptions = await parse({
      mode: "get",
      ffmpeg: true,
    });

    const expectedOptions = {
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: getPlatform(platform),
      arch: getArch(arch),
      cacheDir: "./cache",
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions",
      cache: true,
      ffmpeg: true,
      logLevel: "info",
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });
});
