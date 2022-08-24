const getNwPath = (platform) => {
  switch (platform) {
    case "linux":
      return "nw";
    case "osx":
      return "nwjs.app/Contents/MacOS/nwjs";
    case "win":
      return "nw.exe";
    default:
      null;
  }
};

export default getNwPath;
