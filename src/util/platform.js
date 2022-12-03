import { log } from "../log.js";

/**
 * Get user's computer platform
 *
 * @param  {NodeJS.process.platform}                     platform  Node's process
 * @return {Promise<"osx"| "win" | "linux" | undefined>}           NW.js supported return types
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
