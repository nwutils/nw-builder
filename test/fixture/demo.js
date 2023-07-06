import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "latest",
  srcDir: "app",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.icns",
  },
});
