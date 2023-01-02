#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import nwbuild from "./nwbuild.js";

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
  .parse();

nwbuild({
  ...cli,
  srcDir: cli._.join(" "),
});