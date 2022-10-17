/**
 *
 * @param platform
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
