#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import nwbuild from "../src/api/nwbuild.js";

const cli = yargs(hideBin(process.argv))
  .version(false)
  .command("[appDir] [options]")
  .option("mode", {
    type: "string",
    description: "`run` or `build` application",
    demandOption: true,
  })
  .option("version", {
    type: "string",
    description: "version of NW.js binary",
    demandOption: true,
  })
  .option("flavour", {
    alias: "flavor",
    type: "string",
    description: "`sdk` for development `normal` for distribution",
    demandOption: true,
  })
  .option("platform", {
    type: "string",
    description: "`linux` for Linux, `osx` for Mac or `win` for Windows",
    demandOption: true,
  })
  .option("architecture", {
    type: "string",
    description: "`ia32` for 32-bit version or `x64` for 64-bit version",
    demandOption: true,
  })
  .option("cacheDir", {
    type: "string",
    description: "Location of downloaded NW.js binary",
    demandOption: true,
  })
  .option("buildDir", {
    type: "string",
    description: "Location of build NW.js app",
    demandOption: true,
  })

  .parse();

nwbuild({
  ...cli,
  files: cli._,
});
