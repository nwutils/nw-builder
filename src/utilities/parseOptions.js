const parseOptions = (options, defaultOptions) => {
  for (const key of Object.keys(options)) {
    if (Object.hasOwnProperty.call(defaultOptions, key)) {
      defaultOptions[key] = options[key];
    }
  }
  return defaultOptions;
};

export default parseOptions;
