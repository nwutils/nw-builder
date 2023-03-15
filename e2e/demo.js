import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./app/**/*",
  mode: "build",
  version: "0.74.0",
  flavor: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
  cacheDir: "./tmp",
});
