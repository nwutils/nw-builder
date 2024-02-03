import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "get",
  flavor: "sdk",
  srcDir: "app",
});
