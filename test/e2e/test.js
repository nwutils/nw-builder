import nwbuild from "../../src/index.js";
import { describe, it } from "node:test";
import { getPlatform } from "../../src/util/platform.js";
import { arch, platform } from "node:process";
import { getArch } from "../../src/util/arch.js";

describe("test fetch nwjs and ffmpeg", async () => {
  let nwOptions = {
    srcDir: "test/fixture/app",
    mode: "get",
    version: "0.78.1",
    flavor: "sdk",
    platform: getPlatform(platform),
    arch: getArch(arch),
    cacheDir: "./cache",
    glob: false,
    ffmpeg: true,
    logLevel: "debug",
  };

  it("should run", async () => {
    await nwbuild({ ...nwOptions });
  });
});
