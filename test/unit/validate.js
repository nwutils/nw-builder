import { equal } from "node:assert";
import { resolve } from "node:path";
import { arch, platform } from "node:process";
import { describe, it } from "node:test";

import { validate } from "../../src/util/validate.js";
import { getArch } from "../../src/util/arch.js";
import { getPlatform } from "../../src/util/platform.js";

describe("get mode", () => {
  it("default values", async () => {

    const actualOptions = await validate({
      mode: "get",
      version: "latest",
      flavor: "normal",
      platform: getPlatform(platform),
      arch: getArch(arch),
      cacheDir: resolve("./cache"),
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions",
      ffmpeg: false,
    },
      {
        "version": "v0.74.0",
        "date": "2023/03/13",
        "files": ["win-x64", "win-ia32", "linux-x64", "linux-ia32", "osx-x64"],
        "flavors": ["normal", "sdk"],
        "components": {
          "node": "19.7.0",
          "chromium": "111.0.5563.65"
        },
      },
      "v19.7.0"
    );

    equal(actualOptions, undefined);
  });
});
