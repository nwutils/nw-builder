import Arch from "../constants/arch";
import Platform from "../constants/platform";
import getArch from "../utilities/getArch";
import getPlatform from "../utilities/getPlatform";

const detectCurrentPlatform = (process) => {
  const arch = getArch(process.arch);
  const platform = getPlatform(process.platform);

  if (platform === undefined) {
    return undefined;
  }

  return `${platform}${arch === Arch.x64 ? "64" : "32"}`;
};

export default detectCurrentPlatform;
