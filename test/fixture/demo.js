import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "get",
  version: "0.80.0",
  srcDir: "app",
  outDir: "out",
  glob: false,
});
