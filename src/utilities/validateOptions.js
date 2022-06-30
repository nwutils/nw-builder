import fs from "fs";

import Glob from "simple-glob";
import * as yup from "yup";

const validateOptions = (options) => {
  const optionsSchema = yup.object({
    mode: "run" || "build"
  });

  let pkg = {};

  if (typeof options.files === "string" || Array.isArray(options.files)) {
    let matches = Glob(options.files);

    if (matches.length === 0) {
      console.error("package.json not found.");
      process.exit(1);
    }

    matches.forEach((file) => {
      if (file.match("package.json")) {
        pkg = fs.readFileSync(`${file}`, "utf8");
        pkg = JSON.parse(pkg);
      }
    });
  }

  if (pkg.nwbuild) {
    pkg.nwbuild.files = options.files;
    return optionsSchema.validateSync(pkg.nwbuild);
  } else {
    return optionsSchema.validateSync(options);
  }
};

export default validateOptions;
