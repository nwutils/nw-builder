import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "latest",
  srcDir: "app",
  platform: "osx",
  arch: "arm64",
  downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
  manifestUrl:
    "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.icns",
  },
});
