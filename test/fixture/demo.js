import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "0.77.0",
  srcDir: "app",
  outDir: "out",
  glob: false,
});
