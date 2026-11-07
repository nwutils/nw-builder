import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, beforeEach, describe, it } from "node:test";

import util from "../../../packages/builder/src/util.js";

/**
 * List every file under `dir`, relative to it, using `/` separators.
 * @param  {string} dir
 * @returns {Promise<string[]>}
 */
async function listFiles(dir) {
  const entries = await fs.promises.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join("/"),
    )
    .sort();
}

describe("builder copyGlobFiles", () => {
  let tmp = "";
  let appDir = "";
  let destDir = "";

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwbuild-glob-"));
    // tmp/
    //   sample/package.json, sample/js/app.js   (outside the app root)
    //   app/package.json, app/..config, app/src/index.html, app/src/js/app.js
    for (const [file, content] of [
      ["sample/package.json", "{}"],
      ["sample/js/app.js", "sample"],
      ["app/package.json", "{}"],
      ["app/..config", "dots"],
      ["app/src/index.html", "<p>hi</p>"],
      ["app/src/js/app.js", "app"],
    ]) {
      await fs.promises.mkdir(path.join(tmp, path.dirname(file)), {
        recursive: true,
      });
      await fs.promises.writeFile(path.join(tmp, file), content);
    }
    appDir = path.join(tmp, "app");
  });

  beforeEach(async () => {
    destDir = path.join(tmp, "out", "package.nw");
    await fs.promises.rm(path.join(tmp, "out"), {
      recursive: true,
      force: true,
    });
    await fs.promises.mkdir(destDir, { recursive: true });
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  it("keeps paths relative to the app root", async () => {
    await util.copyGlobFiles(
      ["package.json", "src", "src/index.html", "src/js", "src/js/app.js"].map(
        (file) => file.split("/").join(path.sep),
      ),
      destDir,
      appDir,
    );
    assert.deepEqual(await listFiles(destDir), [
      "package.json",
      "src/index.html",
      "src/js/app.js",
    ]);
  });

  it("places absolute matches inside the app root the same way", async () => {
    await util.copyGlobFiles(
      [
        path.join(appDir, "package.json"),
        path.join(appDir, "src", "index.html"),
      ],
      destDir,
      appDir,
    );
    assert.deepEqual(await listFiles(destDir), [
      "package.json",
      "src/index.html",
    ]);
  });

  it("allows file names that start with two dots", async () => {
    await util.copyGlobFiles(["..config"], destDir, appDir);
    assert.deepEqual(await listFiles(destDir), ["..config"]);
  });

  /** @type {[string, () => string][]} */
  const outsideCases = [
    [
      "a match in a sibling directory",
      () => path.join("..", "sample", "js", "app.js"),
    ],
    ["a match directly in the parent", () => path.join("..", "package.json")],
    [
      "an absolute match outside the app root",
      () => path.join(tmp, "sample", "package.json"),
    ],
  ];
  for (const [name, outsideFile] of outsideCases) {
    it(`rejects ${name} and copies nothing`, async () => {
      await assert.rejects(
        util.copyGlobFiles(["package.json", outsideFile()], destDir, appDir),
        /outside the current working directory/,
      );
      // Validation runs before any copy, so even the valid file is not written.
      assert.deepEqual(await listFiles(path.join(tmp, "out")), []);
    });
  }

  it("rejects the pattern from issue #1612 end to end", async () => {
    const previous = process.cwd();
    process.chdir(appDir);
    try {
      const files = /** @type {string[]} */ (
        await util.globFiles({ srcDir: "../sample/**/**", glob: true })
      );
      assert.ok(files.length > 0);
      await assert.rejects(
        util.copyGlobFiles(files, destDir),
        (error) =>
          error instanceof Error &&
          error.message.includes("outside the current working directory") &&
          error.message.includes("glob to false"),
      );
    } finally {
      process.chdir(previous);
    }
    assert.deepEqual(await listFiles(path.join(tmp, "out")), []);
  });
});
