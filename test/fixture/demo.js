import nwbuild from "../../src/index.js";

await nwbuild({
  srcDir: "gyp",
  mode: "build",
  glob: false,
  logLevel: "debug",
  nativeAddon: "gyp"
});
