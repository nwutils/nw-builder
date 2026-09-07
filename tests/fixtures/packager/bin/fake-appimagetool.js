#!/usr/bin/env node

/*
 * Stand-in for the real `appimagetool` binary used by appImage.test.js's
 * happy-path test, so the test suite doesn't need network access or FUSE.
 * It checks the same invariants `appImage()` is responsible for setting up
 * and then writes a marker file at the requested output path.
 *
 * Written as CommonJS: this file is executed directly as `appimagetool-<arch>.AppImage`
 * (an unrecognised extension), and Node's ESM loader rejects unknown
 * extensions outright, so it must run through the extension-agnostic CJS loader.
 */

const fs = require("node:fs");
const path = require("node:path");

const [flag, appDir, outFile] = process.argv.slice(2);

if (flag !== "--no-appstream") {
  console.error(`Expected "--no-appstream" flag. Received: ${flag}`);
  process.exit(1);
}

if (fs.existsSync(path.join(appDir, "AppRun")) === false) {
  console.error(`Expected "${appDir}/AppRun" to exist.`);
  process.exit(1);
}

const desktopFiles = fs
  .readdirSync(appDir)
  .filter((entry) => entry.endsWith(".desktop"));
if (desktopFiles.length !== 1) {
  console.error(
    `Expected exactly one desktop entry file in "${appDir}". Found: ${desktopFiles.length}`,
  );
  process.exit(1);
}

if (process.env.ARCH === undefined) {
  console.error('Expected the "ARCH" environment variable to be set.');
  process.exit(1);
}

fs.writeFileSync(outFile, `fake AppImage for ARCH=${process.env.ARCH}\n`);
