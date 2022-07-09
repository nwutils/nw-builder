import extract from "extract-zip";
import tar from "tar";

import getCacheDir from "./getCacheDir";
import getNwId from "./getNwId";

const unzipNw = (version, flavor, os, arch) => {
  if (os === "linux") {
    tar.x({
      file: `${getCacheDir(version, os)}/${getNwId(
        version,
        flavor,
        os,
        arch,
        true,
      )}`,
      C: `${getCacheDir(version, os)}`,
    });
  } else {
    extract(
      `${getCacheDir(version, os)}/${getNwId(version, flavor, os, arch, true)}`,
      {
        dir: `${getCacheDir(version, os)}`,
      },
    );
  }
};

export default unzipNw;
