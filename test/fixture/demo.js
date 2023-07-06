import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "0.77.0",
  srcDir: "app",
  platform: "osx",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.icns",
  },
});
