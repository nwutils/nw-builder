import fs from "fs";
import * as yup from "yup";

const validateOptions = (options) => {
  const optionsSchema = yup.object({
    mode: "run" | "build" | "package",
  });

  let pkg = {};

  if (
    typeof options.files === "string" &&
    fs.lstatSync(options.files).isDirectory() &&
    fs.existsSync(`${options.files}/package.json`)
  ) {
    pkg = fs.readFileSync(`${options.files}/package.json`, "utf8");
    pkg = JSON.parse(pkg);
  }

  if (pkg.nwbuild) {
    pkg.nwbuild.files = options.files + "**";
    return optionsSchema.validateSync(pkg.nwbuild);
  } else {
    return optionsSchema.validateSync(options);
  }
};

export default validateOptions;
