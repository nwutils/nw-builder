import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "get",
  platform:"osx",
  flavor: "sdk",
  srcDir: "app",
});
