(async () => {
  let nwbuild;
  let log;
  try {
    nwbuild = (await import("nw-builder")).default;
    log = (await import("../src/log.js")).default;
  } catch (e) {
    log.error(e);
  } finally {
    if (nwbuild !== undefined) {
      nwbuild({
        srcDir: "./fixture/demo/*",
        mode: "build",
        version: "0.73.0",
        flavor: "normal",
        outDir: "./fixture/out/nix",
        cacheDir: "./fixture/tmp"
      });
    }
  }
})();