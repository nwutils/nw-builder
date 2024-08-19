import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "build",
  flavor: "sdk",
  platform: "win",
  srcDir: "./tests/fixtures/app",
  cacheDir: "./node_modules/nw",
  outDir: './tests/fixtures/out',
  app: {
    name: 'nwapp',
    // MacOS options
    LSApplicationCategoryType: 'public.app-category.utilities',
    CFBundleIdentifier: 'io.nwutils.demo',
    CFBundleName: 'Demo',
    CFBundleDisplayName: 'Demo',
    CFBundleSpokenName: 'Demo',
    CFBundleVersion: '0.0.0',
    CFBundleShortVersionString: '0.0.0',
    NSHumanReadableCopyright: 'Copyright (c) 2024 NW.js Utilities'
  }
});
