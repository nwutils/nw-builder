import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./app/*",
  mode: "get",
  version: "0.73.0",
  flavor: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
  cacheDir: "./tmp",
});
