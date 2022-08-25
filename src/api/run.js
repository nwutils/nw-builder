import fs from "node:fs";

import { install } from "nw-install";
import { develop } from "nw-develop";

const run = async (
  files,
  version,
  flavour,
  platform,
  architecture,
  mirror,
  downloadUrl,
  outDir,
  outFile,
) => {
  let nwPath = `${outDir}/${outFile}`;
  if (fs.existsSync(nwPath) === false) {
    await install(
      version,
      flavour,
      platform,
      architecture,
      mirror,
      downloadUrl,
      outDir,
      outFile,
    );
  }
  await develop(files, nwPath, platform);
};

export default run;
