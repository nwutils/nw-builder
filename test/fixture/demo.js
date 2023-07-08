import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  version: "latest",
  srcDir: "app",
  platform: "osx",
  arch: "x64",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.icns",
    NSHumanReadableCopyright: "Copyright 2023 NW Utils. All Rights Reserved."
  },
});
