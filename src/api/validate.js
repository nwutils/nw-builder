import fs from "node:fs";

import * as yup from "yup";

/**
 * OptionsSchema
 * @typedef {object} OptionsSchema
 * @property {string | string[]} files
 * @property {string} version
 * @property {"sdk" | "normal"} flavor
 *
 * @property {string[]} platforms
 * @property {string} appName
 * @property {string} appVersion
 * @property {string} cacheDir
 * @property {string} buildDir
 * @property {"default" | "versioned" | "timestamped"} buildType
 * @property {string[]} argv
 * @property {string} macCredits
 * @property {string} macIcns
 * @property {string | Object} macPlist
 * @property {string} winIco
 * @property {string} winVersionString
 * @property {boolean} zip
 * @property {object} zipOptions
 * @property {boolean} mergeZip
 */

/**
 * Validate nw-builder options
 * @param {OptionsSchema} options
 * @returns {boolean}
 */
const validate = (options) => {
  if (typeof options === "function") {
    return false;
  }
  const optionsSchema = yup
    .object()
    .shape({
      files: yup.string().required() || yup.array.of(yup.string()).required(),
      version: yup.string().matches(/(latest|stable|^\d+\.\d+\.\d+$)/),
      flavor: yup.string().matches(/(sdk|normal)/),
      platforms: yup.array().of(yup.string().matches(/(linux|osx|win)(32|64)/)),
      cacheDir: yup.string(),
      buildDir: yup.string(),
      buildType: yup.string().matches(/(default|versioned|timestamped)/),
      argv: yup.array().of(yup.string()),
      macCredits: yup.string(),
      macIcns: yup.string(),
      macPlist: yup.string(),
      winIco: yup.string(),
      winVersionString: yup.string(),
      zip: yup.boolean(),
      zipOptions: yup.object(),
      mergeZip: yup.boolean(),
    })
    .typeError("options should be of type object");

    if (optionsSchema.isValidSync(options)) {
      for (const file of options.files) {
        if (!fs.statSync(file)) {
          return false;
        }
      }

      if (!fs.statSync(options.cacheDir)) {
        return false;
      }

      if (!fs.statSync(options.buildDir)) {
        return false;
      }
    } else {
      return false;
    };
};

export { validate };
