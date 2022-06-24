const Options = {
  // Run API
  files: null,
  cacheDir: "./cache",
  platforms: [detectCurrentPlatform(process)],
  currentPlatform: detectCurrentPlatform(process),
  flavor: "sdk",
  downloadUrl: "https://dl.nwjs.io/",
  manifestUrl: "https://nwjs.io/versions.json",
  // Build API
  appName: false,
  appVersion: false,
  version: "latest",
  buildDir: "./build",
  buildType: "default",
  forceDownload: false,
  macCredits: false,
  macIcns: false,
  macZip: null,
  macPlist: false,
  winVersionString: {},
  winIco: null,
  useRcedit: false,
  argv: [],
  // Package API
  zip: null,
  zipOptions: null,
  mergeZip: true,
};

export default Options;