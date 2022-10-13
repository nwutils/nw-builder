import fs from "node:fs";

import { decompress } from "./install/decompress.js";
import { develop } from "./run/develop.js";
import { download } from "./install/download.js";
import { remove } from "./install/remove.js";
import { packager } from "./bld/package.js";

const nwbuild = async ({
  srcDir,
  cacheDir = "/cache",
  version,
  flavour,
  platform,
  arch,
  outDir,
  downloadUrl = "https://dl.nwjs.io",
  manifestUrl,
  // flags
  noCache = false,
  noGlob = true,
  zip = false,
  run = false,
}) => {
  // validate inputs

  let nwDir = `${cacheDir}/nwjs-${flavour}-v${version}-${platform}-${arch}`;

  if (
    noCache === true ||
    fs.existsSync(
      nwDir,
    ) === false
  ) {
    await download(version, flavour, platform, arch, downloadUrl, cacheDir);
    await decompress(platform, cacheDir);
    await remove(platform, cacheDir);
  }

  // run app

  if (run === true) {
    await develop(srcDir, nwDir, platform);
  } else {
    packager(srcDir, nwDir, outDir, platform);
  }

  // build app

  // linux config

  // window config

  // macos config
};

nwbuild({ srcDir: "./test/demo", cacheDir: "./cache", version: "0.69.1", flavour: "sdk", platform:"linux", arch:"x64", outDir:"./dev", run: false });
