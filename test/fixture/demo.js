import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "0.80.0",
  platform: "osx",
  srcDir: "app",
  outDir: "out",
  glob: false,
  logLevel: "debug",
});
