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

const args = process.argv.slice(2);
const flags = [];
let signKey;
let updateInformation;
while (args.length > 0 && args[0].startsWith("--")) {
  const flag = args.shift();
  if (flag === "--sign-key") {
    signKey = args.shift();
  }
  if (flag === "--updateinformation") {
    updateInformation = args.shift();
  }
  flags.push(flag);
}
const [appDir, outFile] = args;

if (flags.includes("--no-appstream") === false) {
  console.error(`Expected "--no-appstream" flag. Received: ${flags}`);
  process.exit(1);
}

if (signKey !== undefined && flags.includes("--sign") === false) {
  console.error('Expected "--sign-key" to be accompanied by "--sign".');
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

let contents = `fake AppImage for ARCH=${process.env.ARCH}\n`;
if (flags.includes("--sign")) {
  contents += `signed with key=${signKey ?? "default"}\n`;
}
if (updateInformation !== undefined) {
  contents += `updateinformation=${updateInformation}\n`;
}
const appUpdateConfigPath = path.join(appDir, "app-update.yml");
if (fs.existsSync(appUpdateConfigPath)) {
  contents += `app-update.yml:\n${fs.readFileSync(appUpdateConfigPath, "utf-8")}`;
}
fs.writeFileSync(outFile, contents);

/*
 * Like the real tool, run `zsyncmake` (unless the test simulates it being
 * missing), which writes `<AppImage basename>.zsync` to the working directory.
 */
if (
  updateInformation !== undefined &&
  process.env.FAKE_APPIMAGETOOL_NO_ZSYNCMAKE === undefined
) {
  fs.writeFileSync(
    path.join(process.cwd(), `${path.basename(outFile)}.zsync`),
    "fake zsync\n",
  );
}
