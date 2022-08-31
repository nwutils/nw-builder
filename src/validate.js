import * as yup from "yup"

const validate = async (options) => {
    let optionsSchema = yup.object({
        mode: yup.matches(/(run|build)/),
        appDir: yup.string().required(),
    });

    let validatedOptions = await optionsSchema.validate(options);

    return validatedOptions;
};

export default validate;