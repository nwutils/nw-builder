import checkPkgOptions from "./checkPkgOptions";

const parseOptions = (options, defaultOptions) => {
  const pkgOptions = checkPkgOptions(options.files);
  let tmpOptions = {};
  if (Object.entries(pkgOptions).length !== 0) {
    tmpOptions = parseOptions(pkgOptions, Options);
    tmpOptions = options.files;
  } else {
    tmpOptions = parseOptions(options, Options);
  }

  for (const key of Object.keys(options)) {
    if (defaultOptions.hasOwnProperty(key)) {
      defaultOptions[key] = options[key];
    }
  }
  return defaultOptions;
};

export default parseOptions;
