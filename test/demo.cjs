const NwBuilder = require("../lib/index.cjs");

const nw = new NwBuilder({
  files: ["demo/*"],
  platforms: ["linux64", "osx64", "win64"],
  version: "0.79.1",
});

nw.build();
