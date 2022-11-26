const { nwbuild } = require("nw-builder");

nwbuild({
  srcDir: "./nwapp",
  version: "0.70.1",
  mode: "run",
  flavour: "sdk",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
});
