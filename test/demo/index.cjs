const NwBuilder = require("../../lib/index.cjs");

const options = {
  files: "./**",
  version: "0.68.1",
  flavor: "sdk",
  cacheDir: "./cache",
};

const nw = new NwBuilder(options);
nw.run(options);
