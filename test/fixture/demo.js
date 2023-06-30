import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  srcDir: "app",
  platform: "osx",
  outDir: "out",
  glob: false,
});
