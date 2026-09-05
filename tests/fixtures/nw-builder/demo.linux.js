import nwbuild from "../../../packages/nw-builder/src/index.js";

await nwbuild({
  mode: "build",
  flavor: "sdk",
  platform: "linux",
  srcDir: "../../tests/fixtures/nw-builder/app",
  cacheDir: "../../node_modules/nw",
  outDir: "../../tests/fixtures/nw-builder/out/linux",
  glob: false,
  logLevel: "debug",
  app: {
    name: "Demo",
    genericName: "Demo",
    noDisplay: false,
    comment: "Tooltip information",
    /* File path of icon from where it is copied. */
    icon: "../../tests/fixtures/nw-builder/app/icon.png",
    hidden: false,
    // TODO: test in different Linux desktop environments
    // onlyShowIn: [],
    // notShowIn: [],
    dBusActivatable: true,
    // TODO: test in Linux environment
    // tryExec: '/path/to/exe?'
    exec: "../../tests/fixtures/nw-builder/out/linux/Demo",
  },
});

console.log("\nExecute `npm run demo:exe:linux` to run the application.");
