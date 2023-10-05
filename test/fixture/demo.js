import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "build",
  version: "0.80.0",
  platform: "osx",
  srcDir: "app",
  outDir: "out",
  glob: false,
  app: {
    name: "demo",
    icon: "app/icon.icns",
    CFBundleIdentifier: "io.nwutils.demo",
    CFBundleName: "demo",
    CFBundleDisplayName: "demo",
    CFBundleVersion: "0.0.0",
    CFBundleShortVersionString: "0.0.0",
    NSHumanReadableCopyright: "Copyright (c) 2023",
  },
});
