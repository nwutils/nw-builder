import fs from "node:fs";

import { install } from "nw-install";

import execute from "../utilities/execute.js";
import getNwPath from "../utilities/getNwPath.js";

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
  let exePath = `${outDir}/${outFile}/${getNwPath(platform)}`;
  const srcFiles = (Array.isArray(files) ? files[0] : files).replace(
    /\*[/*]*/,
    "",
  );
  if (fs.existsSync(`${outDir}/${outFile}`) === false) {
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
  await execute(exePath, srcFiles);
};

export default run;
