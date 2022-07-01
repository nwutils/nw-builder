import fs from "fs";

import Glob from "simple-glob";
import * as yup from "yup";

const validateOptions = (options) => {
  const optionsSchema = yup.object({
    mode: yup.string(),
    files: yup.string().required() || yup.array().of(yup.string()).required(),
    flavor: yup.string(),
    cacheDir: yup.string(),
    platforms: yup.array().of(yup.string()),
    currentPlatform: yup.string(),

    appName: yup.string(),
    appVersion: yup.string(),
    buildDir: yup.string(),
    buildType: yup.string(),
    forceDownload: yup.boolean(),
    macCredits: yup.string(),
    macIcns: yup.string(),
    macZip: yup.boolean(),
    macPlist: yup.string() || yup.object(),
    winVersionString: yup.object(),
    winIco: yup.string(),
    useRcedit: yup.boolean(),

    zip: yup.boolean(),
    zipOptions: yup.object(),
    mergeZip: yup.boolean(),
  });

  let pkg = {};

  if (typeof options.files === "string" || Array.isArray(options.files)) {
    let matches = Glob(options.files);

    if (matches.length === 0) {
      console.error("package.json not found.");
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
    pkg.nwbuild.files = options.files;
    return optionsSchema.validateSync(pkg.nwbuild);
  } else {
    return optionsSchema.validateSync(options);
  }
};

export default validateOptions;
