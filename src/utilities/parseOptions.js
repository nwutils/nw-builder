/**
 * @file  Handles creating the options object used by the library.
 */

/**
 * Returns the default options but overrides them
 * when a user passes in a value for the option.
 *
 * @param  {object} options         User options
 * @param  {object} defaultOptions  The default options for the library
 * @return {object}                 The default options, with the user options mixed in
 */
const parseOptions = (options, defaultOptions) => {
  for (const key of Object.keys(options)) {
    if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {
      defaultOptions[key] = options[key];
    }
  }
  return defaultOptions;
};

export default parseOptions;
