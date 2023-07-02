import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "0.70.0",
  srcDir: "app",
  platform: "win",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.ico",
  }
});
