import fs from "node:fs";

import Glob from "simple-glob";
import * as yup from "yup";

/**
 * OptionsSchema
 * @typedef {object} OptionsSchema
 * @property {string | string[] | null} files
 * @property {string | "latest" | "stable"} version
 * @property {"sdk" | "normal"} flavor
 * @property {string} downloadUrl
 * @property {string} manifestUrl
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
    files: yup.string().required(),
    version: yup.string().matches(/(latest|stable|^\d+\.\d+\.\d+$)/),
    flavor: yup.string().matches(/(sdk|normal)/),
    downloadUrl: yup.string(),
    manifestUrl: yup.string(),
    platforms: yup.array().of(yup.string().matches(/(linux|osx|win)(32|64)/)),
    appName: yup.string().nullable(),
    appVersion: yup.string().nullable(),
    cacheDir: yup.string(),
    buildDir: yup.string(),
    buildType: yup.string().matches(/(default|versioned|timestamped)/),
    argv: yup.array().of(yup.string()),
    macCredits: yup.string().nullable(),
    macIcns: yup.string().nullable(),
    macPlist: yup.string().nullable(),
    winIco: yup.string().nullable(),
    winVersionString: yup.object().nullable(),
    zip: yup.boolean().nullable(),
    zipOptions: yup.object().nullable(),
    mergeZip: yup.boolean(),
  }, { strict: true} );

  if (
    typeof options === "function" ||
    optionsSchema.isValidSync(options) === false ||
    typeof options.files === "function" ||
    // TODO(ayushmxn): why does yup give false positive for number and boolean input?
    typeof options.files === "number" ||
    typeof options.files === "boolean"
  ) {
    return false;
  } else {
    let files = Glob(options.files);
    files.forEach((file) => {
      if (typeof file !== "string" || !fs.existsSync(file)) {
        return false;
      }
    });
  }

  return true;
};

export { validate };
