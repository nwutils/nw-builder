import fs from "fs";
import path from "path";

import Glob from "simple-glob";

const checkPkgOptions = (files) => {
  let pkg = {};

  let matches = Glob(files);

  if (matches.length === 0) {
    console.error("[ ERROR ] package.json not found");
    process.exit(1);
  }

  matches.forEach((file) => {
    if (path.basename(file) === "package.json") {
      pkg = fs.readFileSync(`${file}`, "utf8");
      pkg = JSON.parse(pkg);
    }
  });

  if (pkg.nwbuild) {
    return pkg.nwbuild;
  } else {
    return {};
  }
};

export default checkPkgOptions;
