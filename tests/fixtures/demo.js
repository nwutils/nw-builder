import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "get",
  flavor: "sdk",
  platform: "win",
  srcDir: "app",
  cacheDir: "./node_modules/nw"
});
