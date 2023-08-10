import nwbuild from "nw-builder";

await nwbuild({
  mode: "run",
  version: "0.78.1",
  srcDir: "app",
  outDir: "out",
  glob: false,
});
