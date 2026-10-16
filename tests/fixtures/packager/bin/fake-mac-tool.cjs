#!/usr/bin/env node

/*
 * Stand-in for the MacOS tools `dmg()` runs - `hdiutil`, `ditto` and
 * `codesign` - so dmg.test.js runs on any host. Copy it to a file named after
 * the tool. It appends what it was asked to do to the JSON lines file at
 * `$FAKE_MAC_TOOL_LOG`, and writes a marker file wherever the real tool would
 * write its output. `hdiutil` also records what the folder it was given
 * contains, since `dmg()` deletes it straight after.
 *
 * Written as CommonJS to match fake-makensis.cjs.
 */

const fs = require("node:fs");
const path = require("node:path");

const tool = path.basename(process.argv[1]);
const args = process.argv.slice(2);

/**
 * List `dir` recursively, marking symbolic links with their target.
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {string[]}
 */
function list(dir, prefix = "") {
  const entries = [];
  for (const entry of fs.readdirSync(dir).sort()) {
    const fullPath = path.join(dir, entry);
    const relativePath = `${prefix}${entry}`;
    const stats = fs.lstatSync(fullPath);
    if (stats.isSymbolicLink()) {
      entries.push(`${relativePath} -> ${fs.readlinkSync(fullPath)}`);
    } else if (stats.isDirectory()) {
      entries.push(`${relativePath}/`);
      entries.push(...list(fullPath, `${relativePath}/`));
    } else {
      entries.push(relativePath);
    }
  }
  return entries;
}

const record = { tool, args };

if (tool === "hdiutil") {
  const srcfolder = args[args.indexOf("-srcfolder") + 1];
  record.contents = list(srcfolder);
  const appUpdateYaml = record.contents.find((entry) =>
    entry.endsWith("/Contents/Resources/app-update.yml"),
  );
  if (appUpdateYaml !== undefined) {
    record.appUpdateYaml = fs.readFileSync(
      path.join(srcfolder, appUpdateYaml),
      "utf-8",
    );
  }
  fs.writeFileSync(args.at(-1), "fake dmg\n");
} else if (tool === "ditto") {
  fs.writeFileSync(args.at(-1), "fake zip\n");
} else if (tool !== "codesign") {
  console.error(`Unknown tool: ${tool}`);
  process.exit(1);
}

fs.appendFileSync(process.env.FAKE_MAC_TOOL_LOG, `${JSON.stringify(record)}\n`);
