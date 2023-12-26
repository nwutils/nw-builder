import { describe, it } from "node:test";

import nwbuild from "../src/index.js";

describe("bld", () => {

  let nwOptions = {
    srcDir: "test/fixture/app",
    mode: "build",
    version: "0.81.0",
    flavor: "sdk",
    platform: "win",
    arch: "x64",
    outDir: "test/fixture/out/app",
    cacheDir: "test/fixture/cache",
    glob: false,
    app: {
      icon: "icon.ico"
    }
  };

  it("builds Windows application", async () => {
    await nwbuild({ ...nwOptions });
  });
});
