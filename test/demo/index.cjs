const { nwbuild } = require("../../lib/index.cjs");

nwbuild({
  files: "./**",
  mode: "build",
  platforms: ["osx64"]
});
