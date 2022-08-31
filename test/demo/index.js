import nwbuild from "../../src/nwbuild.js";

nwbuild({
  mode: "run",
  appDir: "./test/demo",
  version: "0.67.1",
  flavour: "sdk",
  platform: "linux",
  architecture: "x64",
  cacheDir: "./cache",
  buildDir: "./build",
});
