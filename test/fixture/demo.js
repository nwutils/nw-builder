import nwbuild from "nw-builder";

await nwbuild({
  srcDir: "app/**/* cacheDir/*",
  mode: "build",
  outDir: "out",
});
