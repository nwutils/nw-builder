import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "./nwapp/**/*",
  mode: "run",
  version: "0.70.1",
  flavour: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build/nix",
});
