/**
 * Validate options
 *
 * @param  {object}  options      Options
 * @param  {object}  releaseInfo  Version specific NW release info
 * @return {boolean}              True if options are valid. False otherwise
 */
export const validate = (options, releaseInfo) => {
  if (options && releaseInfo) return true;
  else return false;
};
