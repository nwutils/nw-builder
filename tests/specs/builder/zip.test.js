import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import yauzl from "yauzl-promise";

import decompress from "../../../packages/getter/src/decompress.js";
import util from "../../../packages/builder/src/util.js";

const isWin = process.platform === "win32";

describe("builder zipDirectory", () => {
  let tmp = "";
  let srcDir = "";
  let outDir = "";

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwbuild-zip-"));
    srcDir = path.join(tmp, "app");
    outDir = path.join(tmp, "out");

    await fs.promises.mkdir(path.join(srcDir, "sub", "deep"), {
      recursive: true,
    });
    await fs.promises.mkdir(path.join(srcDir, "empty"));
    await fs.promises.writeFile(path.join(srcDir, "a.txt"), "hi");
    await fs.promises.writeFile(path.join(srcDir, ".hidden"), "dot");
    await fs.promises.writeFile(path.join(srcDir, "sub", "deep", "d.txt"), "d");
    await fs.promises.writeFile(path.join(srcDir, "run.sh"), "#!/bin/sh\n");
    if (!isWin) {
      await fs.promises.chmod(path.join(srcDir, "run.sh"), 0o755);
      await fs.promises.symlink("a.txt", path.join(srcDir, "link-file"));
      await fs.promises.symlink("sub", path.join(srcDir, "link-dir"));
      await fs.promises.symlink("../a.txt", path.join(srcDir, "sub", "up"));
    }

    await util.zipDirectory(srcDir, path.join(tmp, "app.zip"));
    await decompress(path.join(tmp, "app.zip"), outDir);
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  it("puts the directory's contents at the archive root", async () => {
    assert.equal(
      await fs.promises.readFile(path.join(outDir, "a.txt"), "utf8"),
      "hi",
    );
    assert.equal(
      await fs.promises.readFile(
        path.join(outDir, "sub", "deep", "d.txt"),
        "utf8",
      ),
      "d",
    );
    assert.equal(fs.existsSync(path.join(outDir, "app")), false);
  });

  it("includes dotfiles and empty directories", async () => {
    assert.equal(
      await fs.promises.readFile(path.join(outDir, ".hidden"), "utf8"),
      "dot",
    );
    // Read the entry list directly: getter's decompress only creates
    // directories as parents of files, so it drops empty ones.
    const zip = await yauzl.open(path.join(tmp, "app.zip"));
    const names = [];
    try {
      for await (const entry of zip) names.push(entry.filename);
    } finally {
      await zip.close();
    }
    assert.ok(names.includes("empty/"), names.join(", "));
  });

  it("preserves the executable bit", { skip: isWin }, async () => {
    const stats = await fs.promises.stat(path.join(outDir, "run.sh"));
    assert.equal(stats.mode & 0o777, 0o755);
  });

  it("stores symlinks as symlinks", { skip: isWin }, async () => {
    for (const [link, target] of [
      ["link-file", "a.txt"],
      ["link-dir", "sub"],
      [path.join("sub", "up"), path.join("..", "a.txt")],
    ]) {
      const linkPath = path.join(outDir, link);
      assert.ok((await fs.promises.lstat(linkPath)).isSymbolicLink(), link);
      assert.equal(await fs.promises.readlink(linkPath), target, link);
    }
  });

  it("rejects when the source directory does not exist", async () => {
    await assert.rejects(
      util.zipDirectory(path.join(tmp, "missing"), path.join(tmp, "x.zip")),
      { code: "ENOENT" },
    );
  });
});
