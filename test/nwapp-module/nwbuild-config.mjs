import { nwbuild } from "../../src/nwbuild.js";

nwbuild({
  srcDir: "./nwapp", // directory to store nw app files
  excludes: ["**/*.ts", "**/*.txt", "cache", "cache/**",  "build", "build/**", "node_modules", "node_modules/**"],
  version: "0.69.1", // latest or stable or 0.x.y
  flavour: "sdk", //sdk (dev) or normal (prod)
  platform: "osx", //linux, osx, win
  arch: "x64", //ia32 or x64
  outDir: "./build",
  // flags with their default values
  cacheDir: "./cache", //directory to store nw binaries and shared libraries
  downloadUrl: "https://dl.nwjs.io",
  manifestUrl: "https://nwjs.io/versions",
  run: false, //run app to quickly demo it
  noCache: false, //delete and redownload nw version
  zip: false, // optionally zip files
});