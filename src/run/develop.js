import { execute } from "./execute.js";
import { getPlatformSpecificName } from "./getPlatformSpecificName.js";

const develop = async (srcDir, nwDir, platform, argv) => {
  if (getPlatformSpecificName(platform) === null) {
    console.log("Unsupported platform.");
    return 1;
  }

  await execute(srcDir, `${nwDir}/${getPlatformSpecificName(platform)}`, argv);
  return 0;
};

export { develop };
