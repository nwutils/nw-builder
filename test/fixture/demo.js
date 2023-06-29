import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  srcDir: "app",
  outDir: "out",
  zip: "zip",
  logLevel: "debug",
  glob: false,
});
