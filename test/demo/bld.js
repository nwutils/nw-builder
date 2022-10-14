import { nwbuild } from "../../src/nwbuild.js";

nwbuild({
    srcDir: "./nwapp",
    cacheDir: "./cache",
    version: "0.69.1",
    flavour: "normal",
    platform: "osx",
    arch: "x64",
    outDir: "./build",
  });