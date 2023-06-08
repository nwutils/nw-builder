/**
 * Get platform specific name of the executable
 *
 * @param  {string} platform  - Platform
 * @return {string}           - Platform specific name
 */
const getPlatformSpecificName = (platform) => {
  switch (platform) {
    case "linux":
      return "nw";
    case "osx":
      return "nwjs.app/Contents/MacOS/nwjs";
    case "win":
      return "nw.exe";
    default:
      return null;
  }
};

export { getPlatformSpecificName };
