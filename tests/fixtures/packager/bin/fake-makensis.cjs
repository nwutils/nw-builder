#!/usr/bin/env node

/*
 * Stand-in for the real `makensis` binary used by nsis.test.js, so the test
 * suite doesn't need NSIS installed. It checks the arguments `nsis()` passes,
 * writes a marker file at the script's `OutFile` path, and keeps a copy of
 * the script next to it as `<OutFile>.nsi` for the test to inspect.
 *
 * Written as CommonJS to match fake-appimagetool.js, with a `.cjs` extension
 * since this repository's package.json sets `"type": "module"`.
 */

const fs = require("node:fs");

const args = process.argv.slice(2);
const scriptPath = args.at(-1);

if (args[0] !== "-INPUTCHARSET" || args[1] !== "UTF8") {
  console.error(`Expected "-INPUTCHARSET UTF8" flags. Received: ${args}`);
  process.exit(1);
}

const script = fs.readFileSync(scriptPath, "utf-8");
const outFile = script.match(/^OutFile "(.*)"$/m);
if (outFile === null) {
  console.error(`Expected an OutFile line in ${scriptPath}.`);
  process.exit(1);
}

fs.writeFileSync(outFile[1], "fake installer\n");
fs.writeFileSync(`${outFile[1]}.nsi`, script);
