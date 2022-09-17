/**
 * @file    [Description of file purpose]
 * @author  ayushmxn
 */

import Platform from "../constants/Platform";

/**
 * Returns a platform constant based on the current platform.
 *
 * @param  {object}               process  The global Node.js process variable
 * @return {Platform | undefined}          'linux32', 'osx32', 'win64', etc or undefined
 */
const detectCurrentPlatform = (process) => {
  const win64 = (
    process.platform === 'win32' &&
    process.env.PROCESSOR_ARCHITEW6432
  );

  const osMap = {
    win32: Platform.WIN_32,
    darwin: Platform.OSX_32,
    linux: Platform.NIX_32
  };
  if (process.arch === 'x64' || win64) {
    osMap.win32 = Platform.WIN_64;
    osMap.darwin = Platform.OSX_64;
    osMap.linux = Platform.NIX_64;
  }

  return osMap[process.platform];
}

export default detectCurrentPlatform;
