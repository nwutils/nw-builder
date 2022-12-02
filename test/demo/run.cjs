const { nwbuild } = require("nw-builder");

nwbuild({
  srcDir: "./nwapp",
  version: "0.70.1",
  flavour: "sdk",
  platform: "linux",
  arch: "x64",
});
