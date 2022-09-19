// import { getArch } from "./api/getArch";
// import { getPlatform } from "./api/getPlatform";
import { parse } from "./api/parse";
import { platformsParser } from "./api/platformsParser";
import { validate } from "./api/validate";

import Platform from "./constants/Platform";
import Platforms from "./constants/Platforms";
import checkCache from "./utilities/checkCache";
import checkPkgOptions from "./utilities/checkPkgOptions";

export {
  // getArch,
  // getPlatform,
  parse,
  platformsParser,
  validate,
  Platform,
  Platforms,
  checkCache,
  checkPkgOptions,
};
