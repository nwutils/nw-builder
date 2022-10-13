import fs from "node:fs";

import { remove } from "./install/remove.js";
import { decompress } from "./install/decompress.js";
import { download } from "./install/download.js";
import { develop } from "./run/develop.js";

const nwbuild = async ({
  srcDir,
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

  let nwDir = `${outDir}/nwjs-${flavour}-v${version}-${platform}-${arch}`;

  if (
    noCache === true ||
    fs.existsSync(
      `${outDir}/nwjs-${flavour}-v${version}-${platform}-${arch}`,
    ) === false
  ) {
    await download(version, flavour, platform, arch, downloadUrl, outDir);
    await decompress(platform, outDir);
    await remove(platform, outDir);
  }

  // run app

  if (run === true) {
    await develop(srcDir, nwDir, platform);
  }

  // linux config

  // window config

  // macos config

  // build app
};

// nwbuild({ srcDir: "./test/demo", version: "0.69.1", flavour: "sdk", platform:"linux", arch:"x64", outDir:"./dev", run: true });
