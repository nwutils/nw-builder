import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "./nwapp/**/*",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "osx",
  arch: "x64",
  outDir: "./build/osx",
});
