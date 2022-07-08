import fs from "fs";

import Glob from "simple-glob";

const checkPkgOptions = (files) => {
  let pkg = {};

  if (typeof files === "string" || Array.isArray(files)) {
    let matches = Glob(files);

    if (matches.length === 0) {
      console.error("[ ERROR ] package.json not found");
      process.exit(1);
    }

    matches.forEach((file) => {
      if (file.match(/package.json$/)) {
        pkg = fs.readFileSync(`${file}`, "utf8");
        pkg = JSON.parse(pkg);
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
