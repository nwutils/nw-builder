import nwbuild from "nw-builder";

await nwbuild({
  mode: "get",
  platform: "osx",
  cacheDir: "../../node_modules/nw_cache",
});
