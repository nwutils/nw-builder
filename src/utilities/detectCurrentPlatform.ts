import { Platform, PlatformSchema } from "../schema";

const detectCurrentPlatform = (
  process: NodeJS.Process,
): PlatformSchema | undefined => {
  switch (process.platform) {
    case "darwin":
      return process.arch === "x64" ? Platform.OSX_64 : Platform.OSX_32;

    case "win32":
      return process.arch === "x64" || process.env.PROCESSOR_ARCHITEW6432
        ? Platform.WIN_64
        : Platform.WIN_32;

    case "linux":
      return process.arch === "x64" ? Platform.NIX_64 : Platform.NIX_32;
    default:
      return undefined;
  }
};

export default detectCurrentPlatform;
