import nwbuild from "nw-builder";

nwbuild({
  srcDir: "./app/*",
  mode: "build",
  version: "0.73.0",
  flavor: "normal",
  outDir: "./out/nix",
  cacheDir: "./tmp",
});
