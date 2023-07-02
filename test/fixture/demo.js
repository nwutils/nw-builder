import nwbuild from "nw-builder";

await nwbuild({
  mode: "run",
  version: "0.72.0",
  srcDir: "app",
  platform: "win",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
  },
});
