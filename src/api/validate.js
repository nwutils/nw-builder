import * as yup from "yup";

/**
 * OptionsSchema
 * @typedef {Object} OptionsSchema
 * @property {string} files
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
 * @property {Object} zipOptions
 * @property {boolean} mergeZip
 */

/**
 * Validate nw-builder options
 * @param {OptionsSchema} options
 * @returns {OptionsSchema | Error}
 */
const validate = async (options) => {
    const optionsSchema = yup.object({
        files: yup.string().required(),
        version: yup.string().matches(/(latest|stable|^\d+\.\d+\.\d+$)/),
        flavor: yup.string().matches(/(sdk|normal)/),
        platforms: yup.array().of(yup.string().matches(/(linux|osx|win)(32|64)/)),
        cacheDir: yup.string(),
        buildDir: yup.string(),
        buildType: yup.string().matches(/(default|versioned|timestamped)/),
        argv: yup.array.of(yup.string()),
        macCredits: yup.string(),
        macIcns: yup.string(),
        macPlist: yup.string(),
        winIco: yup.string(),
        winVersionString: yup.string(),
        zip: yup.boolean(),
        zipOptions: yup.object(),
        mergeZip: yup.boolean(),
    })

    const error = await optionsSchema.validate(options);
    return error;
};

export { validate };