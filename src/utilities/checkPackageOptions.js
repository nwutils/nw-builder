/**
 * @file  Retrieves options object from package.json
 */

import fs from 'fs';
import path from 'path';

import Glob from 'simple-glob';

/**
 * Loops over all supplied project files to find the `package.json`. Returns the
 * `nwbuild` options object or empty object.
 *
 * @param  {string | Array} files  Glob pattern string or array of glob pattern strings
 * @return {object}                nwbuild options object from package.json or empty object
 */
const checkPackageOptions = (files) => {
  const matches = Glob(files);
  let manifest = {};
  let packageJsonExists = false;

  matches.forEach((file) => {
    if (!packageJsonExists && path.basename(file) === 'package.json') {
      manifest = fs.readFileSync(file, 'utf8');
      manifest = JSON.parse(manifest);
      packageJsonExists = true;
    }
  });

  if (manifest.nwbuild) {
    return manifest.nwbuild;
  }
  return {};
};

export default checkPackageOptions;
