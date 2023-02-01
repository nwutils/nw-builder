import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "./nwapp/**/*",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build/nix",
});
