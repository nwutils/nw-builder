import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "gyp",
  mode: "build",
  glob: false,
  logLevel: "debug",
  nativeAddon: "gyp"
});
