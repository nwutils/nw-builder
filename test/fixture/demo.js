import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  srcDir: "app",
  platform: "linux",
  outDir: "out",
  glob: false,
});
