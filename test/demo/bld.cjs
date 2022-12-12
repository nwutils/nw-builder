const { nwbuild } = require("nw-builder");

const bld = async () => {
  await nwbuild({
    srcDir: "./nwapp",
    mode: "build",
    version: "0.70.1",
    flavour: "normal",
    platform: "linux",
    arch: "x64",
    outDir: "./build/nix",
  });
  // await nwbuild({
  //   srcDir: "./nwapp",
  //   mode: "build",
  //   version: "0.70.1",
  //   flavour: "normal",
  //   platform: "osx",
  //   arch: "x64",
  //   outDir: "./build/osx",
  // });
  // await nwbuild({
  //   srcDir: "./nwapp",
  //   mode: "build",
  //   version: "0.70.1",
  //   flavour: "normal",
  //   platform: "win",
  //   arch: "x64",
  //   outDir: "./build/win",
  // });
};

bld();
