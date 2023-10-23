import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "app",
  mode: "build",
  glob: false,
  logLevel: "debug",
});
