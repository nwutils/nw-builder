#!/usr/bin/env node

import process from "node:process";

import yargs from "yargs/yargs";
import * as yargs_helpers from "yargs/helpers";

import nwbuild from "./index.js";

const cli = yargs(yargs_helpers.hideBin(process.argv))
  .version(false)
  .command("[srcDir] [options]")
  .option("mode", {
    type: "string",
    description: "`get`, `run` or `build` application",
    choices: ["get", "run", "build"]
  })
  .option("version", {
    type: "string",
    description: "NW.js version",
  })
  .option("flavor", {
    type: "string",
    description: "NW.js build flavor",
    choices: ["normal", "sdk"]
  })
  .option("platform", {
    type: "string",
    description: "NW.js supported platform",
    choices: ["linux", "osx", "win"]
  })
  .option("arch", {
    type: "string",
    description: "NW.js supported architecture",
    choices: ["ia32", "x64", "arm64"]
  })
  .option("downloadUrl", {
    type: "string",
    description: "NW.js download server",
  })
  .option("manifestUrl", {
    type: "string",
    description: "NW.js version info",
  })
  .option("cacheDir", {
    type: "string",
    description: "Cache NW.js binaries",
  })
  .option("outDir", {
    type: "string",
    description: "NW.js build artifacts",
  })
  .option("app", {
    type: "object",
    description: "Platform specific app metadata. Refer to docs for more info",
  })
  .option("cache", {
    type: "boolean",
    description: "Flag to enable/disable caching",
  })
  .option("ffmpeg", {
    type: "boolean",
    description: "Flag to enable/disable downloading community ffmpeg",
  })
  .option("glob", {
    type: "boolean",
    description: "Flag to enable/disable globbing",
  })
  .option("logLevel", {
    type: "string",
    description: "Specify log level",
    choices: ["error", "warn", "info", "debug"]
  })
  .option("zip", {
    type: "string",
    description: "Flag to enable/disable compression",
    choices: ["zip", "tar", "tgz"]
  })
  .option("managedManifest", {
    type: "string",
    description: "Managed manifest mode",
  })
  .option("nodeAddon", {
    type: "string",
    description: "Download NW.js Node headers",
    choices: [false, "gyp"]
  })
  .strictOptions()
  .parse();

nwbuild({
  ...cli,
  srcDir: cli._.join(" "),
  cli: true,
});
