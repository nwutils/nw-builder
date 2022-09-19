import detectCurrentPlatform from "../utilities/detectCurrentPlatform";

import { NW_VERSION_LATEST } from "./constants";
import { parse } from "./parse";

test("parse options if none are defined", () => {
  expect(parse({})).toEqual({
    files: null,
    version: NW_VERSION_LATEST,
    flavor: "sdk",
    downloadUrl: "https://dl.nwjs.io",
    manifestUrl: "https://nwjs.io/versions.json",
    platforms: [detectCurrentPlatform(process)],
    appName: null,
    appVersion: null,
    cacheDir: "cache",
    buildDir: "build",
    buildType: "default",
    argv: [],
    macCredits: null,
    macIcns: null,
    macPlist: null,
    winIco: null,
    winVersionString: null,
    zip: null,
    zipOptions: null,
    mergeZip: true,
  });
});
