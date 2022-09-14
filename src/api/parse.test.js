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
    cacheDir: "cacheDir",
    buildDir: "buildDir",
    buildType: "default",
    argv: [],
    macCredits: false,
    macIcns: false,
    macPlist: false,
    winIco: null,
    winVersionString: {},
    zip: null,
    zipOptions: null,
    mergeZip: true,
  });
});
