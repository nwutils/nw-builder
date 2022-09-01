import * as yup from "yup";

/**
 *
 * @param {import("./nwbuild").OptionsSchema} options
 * @returns {Promise<any>} - not sure about the return type
 */
const validate = async (options) => {
  let optionsSchema = yup.object({
    mode: yup
      .string()
      .matches(/(run|build)/)
      .required(),
    appDir: yup.string().required(),
    version: yup.string().matches(/\d+\.\d+\.\d+/),
    flavour: yup
      .string()
      .matches(/(sdk|normal)/)
      .required(),
    platform: yup
      .string()
      .matches(/(linux|osx|win)/)
      .required(),
    architecture: yup
      .string()
      .matches(/(ia32|x64)/)
      .required(),
    cacheDir: yup.string().required(),
    buildDir: yup.string().required(),
  });

  let validatedOptions = await optionsSchema.validate(options);

  return validatedOptions;
};

export default validate;
