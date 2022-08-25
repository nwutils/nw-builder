#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import nwbuild from "../index.js";

const cli = yargs(hideBin(process.argv))
  .version(false)
  .command("[file(glob)] [options]")
  .option("mode", {
    type: "string",
    description: "Choose between run and build mode",
    demandOption: true,
  })
  .option("version", {
    type: "string",
    description: "Version of NW.js you want to use.",
    group: "Run API",
    demandOption: true,
  })
  .option("flavour", {
    type: "string",
    description:
      "sdk is recommended for development and normal is recommended for production.",
    group: "Run API",
    demandOption: true,
  })
  .option("outDir", {
    type: "string",
    description: "Path to NW.js cache",
    group: "Run API",
  })
  .parse();

nwbuild({
  ...cli,
  files: cli._,
});
