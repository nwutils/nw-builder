import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "get",
  flavor: "sdk",
  platform: "osx",
  srcDir: "app",
});
