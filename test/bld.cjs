const nwbuild  = import("../src/nwbuild.js").nwbuild;

nwbuild({
  srcDir: "./nwapp",
  version: "0.70.1",
  flavour: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
});
