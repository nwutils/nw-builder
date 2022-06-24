/**
 *
 * @param {object} options
 * @param {object} defaultOptions
 * @returns {object}
 */
 const parseOptions = (options, defaultOptions) => {
    for (const key of Object.keys(options)) {
      defaultOptions[key] = options[key];
    }
    return defaultOptions;
  };

  export default parseOptions;