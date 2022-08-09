import extract from "extract-zip";
import tar from "tar";

import getNwId from "../utilities/getNwId";

const unzip = async (
  version,
  flavour,
  platform,
  arch,
  outDir,
) => {
  if (platform === "linux") {
    tar.x({
      file: `${outDir}/${getNwId(version, flavour, platform, arch)}`,
      C: `${outDir}`,
    });
  } else {
    extract(`${outDir}/${getNwId(version, flavour, platform, arch)}`, {
      dir: `${outDir}`,
    });
  }
};

export default unzip;
