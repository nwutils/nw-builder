const NwBuilder = require("../../lib/index.cjs");

const options = {
  files: "./**",
  version: "0.68.1",
  flavor: "sdk",
  platforms: ["linux32", "linux64"],
};

const nw = new NwBuilder(options);
nw.build();
