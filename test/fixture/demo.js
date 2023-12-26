import nwbuild from "../../src/index.js";

await nwbuild({
  mode: "build",
  flavor: "sdk",
  platform: "win",
  srcDir: "app",
  glob: false,
  app: {
    icon: "icon.png"
  }
});
