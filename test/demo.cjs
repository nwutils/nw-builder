const NwBuilder = require("../lib/index.cjs");

const nw = new NwBuilder({
  files: ["demo/*"],
  platforms: ["win64"],
  version: "0.79.1",
  flavor: "sdk",
  // These dirs are used by Selenium too
  cacheDir: "../cache",
  buildDir: "../build",
});

nw.run();
