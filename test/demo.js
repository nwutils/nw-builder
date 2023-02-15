import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./fixture/demo/*",
  mode: "build",
  version: "0.73.0",
  flavor: "normal",
  outDir: "./fixture/out/nix",
  cacheDir: "./fixture/tmp",
});
