import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./app/*",
  mode: "build",
  version: "latest",
  flavor: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./out",
  cacheDir: "./tmp",
  downloadUrl: "https://npm.taobao.org/mirrors/nwjs",
});
