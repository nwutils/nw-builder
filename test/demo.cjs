const NwBuilder = require("../lib/index.cjs");

// const nw = new NwBuilder({
//   files: ["demo/*"],
//   platforms: ["win64"],
//   version: "0.79.1",
//   flavor: "sdk",
//   cacheDir: "../cache",
//   buildDir: "../build",
// });

// nw.run();

const nw = new NwBuilder({
  files: ["demo/*"],
  platforms: undefined,
  buildType: "timestamped"
});

nw.init()
