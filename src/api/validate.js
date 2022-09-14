import fs from "node:fs";

import * as yup from "yup";

/**
 * OptionsSchema
 * @typedef {object} OptionsSchema
 * @property {string | string[] | null} files
 * @property {string | "latest" | "stable"} version
 * @property {"sdk" | "normal"} flavor
 * @property {string[]} platforms
 * @property {string | false} appName
 * @property {string | false} appVersion
 * @property {string} cacheDir
 * @property {string} buildDir
 * @property {"default" | "versioned" | "timestamped" | Function} buildType
 * @property {string[]} argv
 * @property {string | false} macCredits
 * @property {string | false} macIcns
 * @property {string | Object} macPlist
 * @property {string | null} winIco
 * @property {object} winVersionString
 * @property {boolean | null} zip
 * @property {object | null} zipOptions
 * @property {boolean} mergeZip
 */

/**
 * Validate nw-builder options
 * @param {OptionsSchema} options
 * @returns {boolean}
 */
const validate = (options) => {
  const optionsSchema = yup.object({
    files: yup.string().defined(),
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
  });

  if (optionsSchema.isValidSync(options) === false) {
    return false;
  }

  if (Array.isArray(options.files)) {
    for (const file of options.files) {
      if (typeof file !== "string" || !fs.statSync(file)) {
        return false;
      }
    }
  } else {
    if (typeof file !== "string" || !fs.statSync(options.files)) {
      return false;
    }
  }

  return true;
};

export { validate };
