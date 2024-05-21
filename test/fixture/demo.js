import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "build",
  platform: "win",
  flavor: "sdk",
  srcDir: "app",
});
