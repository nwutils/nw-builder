const platformsParser = (platforms) => {
  platforms.forEach((platform, index) => {
    if (platform === "linux") {
      platforms[index] = "linux32";
      platforms.push("linux64");
    }
    if (platform === "osx") {
      platforms[index] = "osx32";
      platforms.push("osx64");
    }
    if (platform === "win") {
      platforms[index] = "win32";
      platforms.push("win64");
    }
  });
  return platforms;
};

export { platformsParser };
