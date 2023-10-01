import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "build",
  version: "0.80.0",
  platform: "osx",
  srcDir: "app",
  outDir: "out",
  glob: false,
});
