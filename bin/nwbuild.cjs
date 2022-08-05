#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { nwbuild } = require("../lib/index.cjs");
const { Options, detectCurrentPlatform } = require("../dist/index.cjs");

const cli = yargs(hideBin(process.argv))
  .version(false)
  .command("[file(glob)] [options]")
  .option("mode", {
    type: "string",
    description: "Choose between run and build mode",
    default: Options["mode"],
  })
  .option("quiet", {
    type: "string",
    description:
      "Choose your level of logging between error, warn, info, debug and off",
    default: Options["quiet"],
  })
  .option("version", {
    type: "string",
    description: "Version of NW.js you want to use.",
    group: "Run API",
    default: Options["version"],
  })
  .option("flavor", {
    type: "string",
    description:
      "sdk is recommended for development and normal is recommended for production.",
    group: "Run API",
    default: Options["flavor"],
  })
  .option("cacheDir", {
    type: "string",
    description: "Path to NW.js cache",
    group: "Run API",
    default: Options["cacheDir"],
  })
  .option("platforms", {
    type: "array",
    description:
      "Supported platforms are linux32, linux64, osx32, osx64, win32, win64",
    group: "Run API",
    default: detectCurrentPlatform(process),
  })
  .option("appName", {
    type: "string",
    description: "Name of your application",
    group: "Build API",
    default: Options["appName"],
  })
  .option("appVersion", {
    type: "string",
    description: "Version of your application",
    group: "Build API",
    default: Options["appVersion"],
  })
  .option("buildDir", {
    type: "string",
    description: "Path to NW.js build",
    group: "Build API",
    default: Options["buildDir"],
  })
  .option("buildType", {
    type: "string",
    description:
      "default is appName, \nversioned is [appName] -v[appVersion], \ntimestamped is [appName] - [timestamp]",
    group: "Build API",
    default: Options["buildType"],
  })
  .option("forceDownload", {
    type: "boolean",
    description: "Delete all cache and builds and redownload them",
    group: "Build API",
    default: Options["forceDownload"],
  })
  .option("macCredits", {
    type: "string",
    description:
      "The path to your credits.html file. By default it uses the one provided by NW.js",
    group: "Build API",
    default: Options["macCredits"],
  })
  .option("macIcns", {
    type: "string",
    description:
      "The path to your ICNS file. By default it uses the one provided by NW.js",
    group: "Build API",
    default: Options["macIcns"],
  })
  .option("macPlist", {
    type: "string",
    description:
      "The path to your Plist file. By default a Plist file is generated from the package.json",
    group: "Build API",
    default: Options["macPlist"],
  })
  .option("winVersionString", {
    type: "object",
    description: "Descriptors for Windows executable",
    group: "Build API",
    default: Options["winVersionString"],
  })
  .option("winIco", {
    type: "string",
    description:
      "Path to your ICO file. By default it uses the one provided by NW.js",
    group: "Build API",
    default: Options["winIco"],
  })
  .option("useRcedit", {
    type: "string",
    description:
      "If set to true, it allows you to set the Windows icon using rcedit instead of winresourcer",
    group: "Build API",
    default: Options["useRcedit"],
  })
  .option("zip", {
    type: "boolean",
    description: "Zip your NW.js application",
    group: "Package API",
    default: Options["zip"],
  })
  .option("zipOptions", {
    type: "boolean",
    description:
      "Configure the underling zip library parameters, like store or compression ratio",
    group: "Package API",
    default: Options["zipOptions"],
  })
  .option("mergeZip", {
    type: "boolean",
    description: "Merge the source file package with the NW.js executable",
    group: "Package API",
    default: Options["mergeZip"],
  })
  .parse();

nwbuild({
  ...cli,
  currentPlatform: detectCurrentPlatform(process),
  files: cli._,
});
