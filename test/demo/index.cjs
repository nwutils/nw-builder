const { nwbuild } = require("../../lib/index.cjs");

nwbuild({
  files: "./**",
  version: "0.67.1",
  platforms: ["linux64"],
  mode: "build",
});
