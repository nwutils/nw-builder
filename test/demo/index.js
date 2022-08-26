import nwbuild from "../../src/api/nwbuild.js";

nwbuild({
  mode: "run",
  files: ".",
  version: "0.67.1",
  flavour: "sdk",
  platform: "linux",
  architecture: "x64",
  cacheDir: "./cache",
  buildDir: "./build",
});