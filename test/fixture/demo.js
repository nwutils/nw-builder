import nwbuild from "nw-builder";

await nwbuild({
  mode: "build",
  srcDir: "app/package.json app/src/**/*",
  outDir: "out",
});
