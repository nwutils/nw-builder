#!/usr/bin/env node
const NwBuilder = require("../lib/index.cjs");
const path = require("path");
const { detectCurrentPlatform } = require("../dist/index.cjs");

const currentPlatform = detectCurrentPlatform(process);

const argv = require("yargs")
  .command("$0 <path>")
  .usage("Usage:\n  $0 [options] [path] [-- <args>]")

  .alias("p", "platforms")
  .default("p", currentPlatform)
  .describe(
    "p",
    "Platforms to build, comma-sperated, can be: \n  win32, win64, osx32, osx64, linux32, linux64 or \nwin, osx, linux",
  )

  .version(false)
  .alias("v", "version")
  .default("v", "latest")
  .describe("v", "The NW.js version, eg. 0.8.4")

  .alias("r", "run")
  .default("r", false)
  .describe("r", "Runs NW.js for the current platform")
  .boolean("r")

  .alias("o", "buildDir")
  .default("o", "./build")
  .describe("o", "The build folder")

  .alias("f", "forceDownload")
  .default("f", false)
  .describe("f", "Force download of NW.js")
  .boolean("f")

  .alias("n", "name")
  .describe("n", "The Name of your NW.js app.")

  .describe("cacheDir", "The cache folder")

  .default("quiet", false)
  .describe("quiet", "Disables logging")
  .boolean("quiet")

  .describe(
    " <args>",
    "Pass custom arguments to the NW.js instance \n(-r, --run mode only)",
  )

  // Howto Help
  .help("h")
  .alias("h", "help")

  .wrap(100).argv;

const options = {
  appName: argv.name,
  files: path.resolve(process.cwd(), argv.path) + "/**/*",
  flavor: argv.flavor || "sdk",
  platforms: argv.platforms ? argv.platforms.split(",") : [currentPlatform],
  currentPlatform: currentPlatform,
  version: argv.version,
  macCredits: argv.macCredits || false,
  macPlist: argv.macPlist || false,
  macIcns: argv.macIcns || false,
  winIco: argv.winIco || false,
  cacheDir: argv.cacheDir
    ? path.resolve(process.cwd(), argv.cacheDir)
    : path.resolve(__dirname, "..", "cache"),
  buildDir: path.resolve(process.cwd(), argv.buildDir),
  buildType: argv.buildType || 'default',
  forceDownload: argv.forceDownload,
  // get all argv arguments after --
  argv: process.argv.slice(
    process.argv.findIndex(function firstDash(el) {
      return el === "--";
    }) + 1,
  ),
  zip: argv.zip || null,
  zipOptions: argv.zipOptions || null
};

// Initialize Builder
const nw = new NwBuilder(options);

// Logging
if (!(argv.quiet || argv.quite)) {
  nw.on("log", console.log);
}

// Build or Run the app
const np = argv.r ? nw.run() : nw.build();
np.then(function () {
  process.exit(0);
}).catch(function (error) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
