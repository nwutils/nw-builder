import Platform from "../constants/platform";

const getPlatform = (platform) => {
  switch (platform) {
    case "darwin":
      return Platform.OSX;
    case "win32":
      return Platform.WIN;
    case "linux":
      return Platform.NIX;
    default:
      return undefined;
  }
};

export default getPlatform;
