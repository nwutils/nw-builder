const { nwbuild } = require("nw-builder");

nwbuild({
  srcDir: "./nwapp",
  mode: "run",
  version: "0.70.1",
  flavour: "sdk",
});
