import * as yup from "yup";

/**
 * A number, or a string containing a number.
 * @typedef {Object} OptionsSchema
 * @property {string} files
 * @property {string} version
 * @property {"sdk" | "normal"} flavor
 * @property {string[]} platforms
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
    })

    const error = await optionsSchema.validate(options);
    return error;
};

export { validate };