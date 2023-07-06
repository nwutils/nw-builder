import nwbuild from "nw-builder";

await nwbuild({
  mode: "get",
  version: "0.77.0",
  outDir: "out",
  ffmpeg: true,
});
