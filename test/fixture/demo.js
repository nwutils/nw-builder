// import nwbuild from "nw-builder";

// await nwbuild({
//     srcDir: "app/**/*",
//     mode: "get",
//     platform: "osx",
//     outDir: "out"
// });

import compressing from "compressing";

compressing.zip.uncompress("cache/nw.zip", "cache/nwjs-v0.77.0-osx-x64");
