const { platform } = require("node:process");
const { nwbuild } = require("nw-builder");

if (platform === "linux") {
  nwbuild({
    srcDir: "./nwapp",
    mode: "build",
    version: "0.70.1",
    flavour: "normal",
    platform: "linux",
    arch: "x64",
    outDir: "./build/nix",
  });
}

if (platform === "darwin") {
  nwbuild({
    srcDir: "./nwapp",
    mode: "build",
    version: "0.70.1",
    flavour: "normal",
    platform: "osx",
    arch: "x64",
    outDir: "./build/osx",
  });
}

if (platform === "win32") {
  nwbuild({
    srcDir: "./nwapp",
    mode: "build",
    version: "0.70.1",
    flavour: "normal",
    platform: "win",
    arch: "x64",
    outDir: "./build/win",
  });
}
