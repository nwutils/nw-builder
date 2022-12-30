/**
 * Returns the platform specific name of the executable.
 *
 * @param  {"win" | "osx" | "linux"} platform  The platform to get the executable name for
 * @return {string | null}                     The platform specific name of the executable
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
