const parseOptions = (options, defaultOptions) => {
  for (const key of Object.keys(options)) {
    if (defaultOptions.hasOwnProperty(key)) {
      defaultOptions[key] = options[key];
    }
  }
  return defaultOptions;
};

export default parseOptions;
