import { nwbuild } from "../../src/index.js";

nwbuild({
  mode: "run",
  files: "./",
  version: "0.67.1",
  flavour: "sdk",
  platform: "linux",
  architecture: "x64",
});
