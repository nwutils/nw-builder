/**
 * Get user's computer platform
 *
 * @param  {string}                             platform  Node's process.platform
 * @return {"osx"| "win" | "linux" | undefined}           NW.js supported platforms
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
      return undefined;
  }
};
