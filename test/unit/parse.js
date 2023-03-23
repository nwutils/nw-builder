import { deepStrictEqual } from "node:assert";
import { resolve } from "node:path";
import { arch, platform } from "node:process";
import { describe, it } from "node:test";

import { parse } from "../../src/util/parse.js";
import { getArch } from "../../src/util/arch.js";
import { getPlatform } from "../../src/util/platform.js";

describe("get mode", () => {
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
      cacheDir: resolve("./cache"),
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions",
      ffmpeg: false,
    };

    deepStrictEqual(actualOptions, expectedOptions);
  });
});
