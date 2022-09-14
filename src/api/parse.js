import process from "node:process";

import detectCurrentPlatform from "../utilities/detectCurrentPlatform.js";
import { NW_VERSION_LATEST, NW_VERSION_STABLE } from "./constants.js";

/**
 * OptionsSchema
 * @typedef {object} OptionsSchema
 * @property {string | string[] | null} files
 * @property {string | "latest" | "stable"} version
 * @property {"sdk" | "normal"} flavor
 * @property {string} downloadUrl
 * @property {string} manifestUrl
 * @property {string[]} platforms
 * @property {string | false} appName
 * @property {string | false} appVersion
 * @property {string} cacheDir
 * @property {string} buildDir
 * @property {"default" | "versioned" | "timestamped" | Function} buildType
 * @property {string[]} argv
 * @property {string | false} macCredits
 * @property {string | false} macIcns
 * @property {string | Object} macPlist
 * @property {string | null} winIco
 * @property {object} winVersionString
 * @property {boolean | null} zip
 * @property {object | null} zipOptions
 * @property {boolean} mergeZip
 */

/**
 * Validate nw-builder options
 * @param {OptionsSchema} options
 * @returns {OptionsSchema}
 */
const parse = (options) => {
  options.files = options.files ?? null;
  options.version = options.version ?? NW_VERSION_LATEST;
  if (options.version === "stable") {
    options.version = NW_VERSION_STABLE;
  }
  options.flavor = options.flavor ?? "sdk";
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions.json";
  options.platforms = options.platforms ?? [detectCurrentPlatform(process)];
  options.appName = options.appName ?? null;
  options.appVersion = options.appVersion ?? null;
  options.cacheDir = options.cacheDir ?? "cacheDir";
  options.buildDir = options.buildDir ?? "buildDir";
  options.buildType = options.buildType ?? "default";
  options.argv = options.argv ?? [];
  options.macCredits = options.macCredits ?? false;
  options.macIcns = options.macIcns ?? false;
  options.macPlist = options.macPlist ?? false;
  options.winIco = options.winIco ?? null;
  options.winVersionString = options.winVersionString ?? {};
  options.zip = options.zip ?? null;
  options.zipOptions = options.zipOptions ?? null;
  options.mergeZip = true.mergeZip ?? true;

  return options;
};

export { parse };
