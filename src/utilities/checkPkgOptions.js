import fs from "fs";
import path from "path";

import Glob from "simple-glob";

const checkPkgOptions = (files) => {
  let pkg = {};

  let matches = Glob(files);

  let packageJsonExists = false;

  if (!packageJsonExists) {
    matches.forEach((file) => {
      if (path.basename(file) === "package.json") {
        pkg = fs.readFileSync(`${file}`, "utf8");
        pkg = JSON.parse(pkg);
        packageJsonExists = true;
      }
    });
  }

  if (pkg.nwbuild) {
    return pkg.nwbuild;
  } else {
    return {};
  }
};

export default checkPkgOptions;
