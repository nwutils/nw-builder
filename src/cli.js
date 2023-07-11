#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import nwbuild from "./index.js";

const cli = yargs(hideBin(process.argv))
  .version(false)
  .command("[srcDir] [options]")
  .option("mode", {
    type: "string",
    description: "`run` or `build` application",
  })
  .option("version", {
    type: "string",
    description: "NW.js version",
  })
  .option("flavor", {
    type: "string",
    description: "NW.js build flavor",
  })
  .option("platform", {
    type: "string",
    description: "NW.js supported platform",
  })
  .option("arch", {
    type: "string",
    description: "NW.js supported architecture",
  })
  .option("outDir", {
    type: "string",
    description: "NW.js build artifacts",
  })
  .option("cacheDir", {
    type: "string",
    description: "Cache NW.js binaries",
  })
  .option("downloadUrl", {
    type: "string",
    description: "NW.js download server",
  })
  .option("manifestUrl", {
    type: "string",
    description: "NW.js version info",
  })
  .option("glob", {
    type: "boolean",
    description: "Flag to enable/disable globbing",
  })
  .option("app", {
    type: "object",
    description: "Platform specific app metadata. Refer to docs for more info",
  })
  .option("cache", {
    type: "boolean",
    description: "Flag to enable/disable caching",
  })
  .option("zip", {
    type: "string",
    description: "Flag to enable/disable compression",
  })
  .option("ffmpeg", {
    type: "string",
    description: "Flag to enable/disable downloading community ffmpeg",
  })
  .option("logLevel", {
    type: "string",
    description: "Specify log level",
  })
  .parse();

nwbuild({
  ...cli,
  srcDir: cli._.join(" "),
  cli: true,
});
