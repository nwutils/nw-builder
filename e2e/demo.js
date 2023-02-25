import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./app/*",
  mode: "build",
  version: "latest",
  flavor: "sdk",
  platform: "osx",
  arch: "arm64",
  outDir: "./out",
  cacheDir: "./tmp",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl:
    "https://raw.githubusercontent.com/nwutils/nw-builder/dev-494/src/util/osx.arm.versions.json",
});
