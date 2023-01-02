import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "./nwapp/**/*",
  mode: "build",
  version: "0.70.1",
  flavour: "normal",
  platform: "osx",
  arch: "x64",
  outDir: "./build/osx",
});
