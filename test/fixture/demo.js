import nwbuild from "nw-builder";

await nwbuild({
  mode: "get",
  flavor: "sdk",
  platform: "osx",
  srcDir: "app"
});
