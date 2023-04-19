import { equal } from "node:assert";
import { resolve } from "node:path";
import { arch, platform } from "node:process";
import { describe, it } from "node:test";

import { validate } from "../../src/util/validate.js";
import { getArch } from "../../src/util/arch.js";
import { getPlatform } from "../../src/util/platform.js";

describe("validate - get mode", () => {
  const mockReleaseInfo = {
    "version": "v0.75.0",
    "date": "2023/04/05",
    "files": ["win-x64", "win-ia32", "linux-x64", "linux-ia32", "osx-x64"],
    "flavors": ["normal", "sdk"],
    "components": {
      "node": "19.7.0",
      "chromium": "112.0.5615.49"
    }
  };

  const mockArmReleaseInfo = {
    "version": "v0.75.0",
    "date": "2023/04/15",
    "files": ["osx-arm64"],
    "flavors": ["normal", "sdk"],
    "components": {
      "node": "19.7.0",
      "chromium": "112.0.5615.49"
    }
  };

  const mockNodeVersion = "v19.7.0";
  const mockArmNodeVersion = "v19.7.0";

  it("default values", async () => {
    const output = await validate(
      {
        mode: "get",
        version: "latest",
        flavor: "normal",
        platform: getPlatform(platform),
        arch: getArch(arch),
        cacheDir: resolve("./cache"),
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions",
        cache: true,
        ffmpeg: false,
      },
      mockReleaseInfo,
      mockNodeVersion,
    );

    equal(output, undefined);
  });

  it("unofficial macos arm", async () => {
    const output = await validate(
      {
        mode: "get",
        version: "latest",
        flavor: "normal",
        platform: "osx",
        arch: "arm64",
        cacheDir: resolve("./cache"),
        downloadUrl:
          "https://github.com/corwin-of-amber/nw.js/releases/download",
        manifestUrl:
          "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
        cache: true,
        ffmpeg: false,
      },
      mockArmReleaseInfo,
      mockArmNodeVersion,
    );

    equal(output, undefined);
  });

  it("china mirror", async () => {
    const output = await validate(
      {
        mode: "get",
        version: "latest",
        flavor: "normal",
        platform: getPlatform(platform),
        arch: getArch(arch),
        cacheDir: resolve("./cache"),
        downloadUrl: "https://npm.taobao.org/mirrors/nwjs/",
        manifestUrl: "https://nwjs.io/versions",
        cache: true,
        ffmpeg: false,
      },
      mockReleaseInfo,
      mockNodeVersion,
    );

    equal(output, undefined);
  });

  it("singapore mirror", async () => {
    const output = await validate(
      {
        mode: "get",
        version: "latest",
        flavor: "normal",
        platform: getPlatform(platform),
        arch: getArch(arch),
        cacheDir: resolve("./cache"),
        downloadUrl: "https://cnpmjs.org/mirrors/nwjs/",
        manifestUrl: "https://nwjs.io/versions",
        cache: true,
        ffmpeg: false,
      },
      mockReleaseInfo,
      mockNodeVersion,
    );

    equal(output, undefined);
  });

  it("prebuilt ffmpeg", async () => {
    const output = await validate(
      {
        mode: "get",
        version: "latest",
        flavor: "normal",
        platform: getPlatform(platform),
        arch: getArch(arch),
        cacheDir: resolve("./cache"),
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions",
        cache: true,
        ffmpeg: true,
      },
      mockReleaseInfo,
      mockNodeVersion,
    );
    equal(output, undefined);
  });
});
