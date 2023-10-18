import nwbuild from "../../src/index.js";

await nwbuild({
  srcDir: "app",
  mode: "build",
  glob: false,
  logLevel: "debug",
  managedManifest: true,
});
