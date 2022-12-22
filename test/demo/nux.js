import { nwbuild } from "nw-builder";

nwbuild({
  srcDir: "./nwapp",
  mode: "build",
  version: "0.70.1",
  flavour: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build/nux",
});
