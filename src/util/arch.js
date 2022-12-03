import { log } from "../log.js";

/**
 * Get user's computer architecture
 *
 * @param  {NodeJS.process.arch}                         arch  Node's process
 * @return {Promise<"osx"| "win" | "linux" | undefined>}       NW.js supported return types
 */
export const getArch = async (arch) => {
  switch (process.arch) {
    case "ia32":
      return "ia32";
    case "x64":
      return "x64";
    default:
      log.error(`The arch ${arch} is not supported`);
      return undefined;
  }
};
