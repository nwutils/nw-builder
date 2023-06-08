/**
 * Get user's computer platform
 *
 * @param  {string}                          platform  Node's process.platform
 * @return {"osx"| "win" | "linux" | string}           Platform types
 */
export const getPlatform = (platform) => {
  switch (platform) {
    case "darwin":
      return "osx";
    case "win32":
      return "win";
    case "linux":
      return "linux";
    default:
      return platform;
  }
};
