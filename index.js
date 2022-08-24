import nwbuild from "./src/api/nwbuild.js";

nwbuild({
  mode: "run",
  files: "./test/demo/**",
  version: "0.67.1",
  flavour: "sdk",
  outDir: "./dev",
  outFile: "nw",
});