import nwbuild from "nw-builder";

await nwbuild({
  mode: "run",
  srcDir: "app",
  cacheDir: "../../node_modules/nw_cache",
  glob: false,
});
