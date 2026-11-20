#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";

import { build, dist, gen, setup, status } from "./main.js";

const USAGE = `build-tools — compile NW.js from source

Usage:
  build-tools <command> [options]

Commands:
  setup    Get depot_tools, NW.js at the release tag and Chromium with all
           dependencies (gclient sync, no git history)
  gen      Write the GN (out/nw) and Node.js GYP (out/Release) build files
  build    Build Node.js, NW.js and copy libnode in. Exits 3 if --stop-at
           stopped it before it finished; run it again to continue
  status   Print how many build steps are left
  dist     Package the binaries (NW's dist target) into out/nw/dist

Options:
  --dir <path>          Work directory, the gclient root (default: ./nwjs)
  --version <v>         NW.js version for setup, or "latest" (default: latest)
  --arch <arch>         Target CPU (default: x64; only Linux x64 for now)
  --flavor <flavor>     normal | sdk (default: normal)
  --cc-wrapper <cmd>    Compiler cache for gen, e.g. sccache
  --install-deps        setup: install Chromium's system packages (sudo)
  --stop-at <time>      build: stop at this Unix time (seconds) so CI jobs
                        can save progress before their time limit
  -h, --help            Show this help
`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dir: { type: "string", default: "nwjs" },
    version: { type: "string", default: "latest" },
    arch: { type: "string", default: "x64" },
    flavor: { type: "string", default: "normal" },
    "cc-wrapper": { type: "string" },
    "install-deps": { type: "boolean", default: false },
    "stop-at": { type: "string" },
    help: { type: "boolean", short: "h", default: false },
  },
});

const [command] = positionals;
if (values.help || !command) {
  console.log(USAGE);
  process.exit(values.help ? 0 : 1);
}
if (values.flavor !== "normal" && values.flavor !== "sdk") {
  console.error(`--flavor must be normal or sdk, not ${values.flavor}`);
  process.exit(1);
}
if (values.arch !== "x64") {
  console.error(`--arch ${values.arch} is not supported yet (only x64)`);
  process.exit(1);
}

/** @type {import("./main.js").Options} */
const options = {
  dir: path.resolve(values.dir),
  version: values.version,
  arch: values.arch,
  flavor: values.flavor,
  ccWrapper: values["cc-wrapper"],
  installDeps: values["install-deps"],
  stopAt:
    values["stop-at"] === undefined
      ? undefined
      : Number(values["stop-at"]) * 1000,
};

try {
  switch (command) {
    case "setup":
      console.log(
        `Checked out NW.js ${await setup(options)} in ${options.dir}`,
      );
      break;
    case "gen":
      await gen(options);
      break;
    case "build":
      if (!(await build(options))) {
        console.log(
          "Build stopped before finishing; run build again to continue.",
        );
        process.exit(3);
      }
      console.log("Build finished.");
      break;
    case "status": {
      const left = status(options);
      console.log(
        left === 0 ? "NW.js is fully built." : `${left} build steps left.`,
      );
      break;
    }
    case "dist":
      for (const file of await dist(options)) {
        console.log(file);
      }
      break;
    default:
      console.error(`Unknown command: ${command}\n\n${USAGE}`);
      process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
