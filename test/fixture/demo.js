import nwbuild from "nw-builder";

await nwbuild({
    srcDir: "app/**/*",
    mode: "build",
    outDir: "out"
});
