import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  srcDir: "app",
  platform: "win",
  outDir: "out",
  glob: false,
});
