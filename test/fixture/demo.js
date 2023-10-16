import nwbuild from "../../src/index.js";

await nwbuild({
  srcDir: "app",
  mode: "get",
  version: "stable",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  cache: true,
  ffmpeg: true,
  glob: false,
  app: {
    company: "Some Company",
    fileDescription: "Process Name",
    productName: "Some Product",
    legalCopyright: "Copyright (c) 2023",
  },
  logLevel: "debug",
});
