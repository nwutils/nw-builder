import { log } from "../log.js";

/**
 * Get user's computer platform
 *
 * @param  {string}                                      platform  Node's process.platform
 * @return {Promise<"osx"| "win" | "linux" | undefined>}           NW.js supported platforms
 */
export const getPlatform = async (platform) => {
  switch (platform) {
    case "darwin":
      return "osx";
    case "win32":
      return "win";
    case "linux":
      return "linux";
    default:
      log.error(`The platform ${platform} is not supported`);
      return undefined;
  }
};
