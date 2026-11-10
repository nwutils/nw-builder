import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import util from "../../../packages/builder/src/util.js";

/**
 * Create a stand-in framework `Versions` directory: real directories named
 * `versions`, plus a `Current` symbolic link to the first one.
 * @param  {string}   root
 * @param  {string[]} versions
 * @returns {Promise<string>}  Path to the `Versions` directory.
 */
async function versionsDir(root, versions) {
  const dir = await fs.promises.mkdtemp(path.join(root, "Versions-"));
  for (const version of versions) {
    await fs.promises.mkdir(path.join(dir, version, "Helpers"), {
      recursive: true,
    });
  }
  if (versions.length > 0) {
    /* A junction needs no extra privileges on Windows. */
    await fs.promises.symlink(
      path.join(dir, versions[0]),
      path.join(dir, "Current"),
      process.platform === "win32" ? "junction" : "dir",
    );
  }
  return dir;
}

describe("builder frameworkVersionDir", () => {
  let tmp = "";

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwbuild-fw-"));
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  it("uses the directory named after the expected version", async () => {
    const dir = await versionsDir(tmp, ["150.0.7871.46"]);
    assert.equal(
      await util.frameworkVersionDir(dir, "150.0.7871.46"),
      path.join(dir, "150.0.7871.46"),
    );
  });

  it("falls back to the only real directory on a version mismatch (nw.js#8371)", async () => {
    const dir = await versionsDir(tmp, ["150.0.7871.0"]);
    assert.equal(
      await util.frameworkVersionDir(dir, "150.0.7871.46"),
      path.join(dir, "150.0.7871.0"),
    );
  });

  it("never resolves to the Current symbolic link", async () => {
    const dir = await versionsDir(tmp, ["150.0.7871.0"]);
    assert.equal(
      await util.frameworkVersionDir(dir, "Current"),
      path.join(dir, "150.0.7871.0"),
    );
  });

  it("throws when the version directory is ambiguous", async () => {
    const dir = await versionsDir(tmp, ["1.0.0", "2.0.0"]);
    await assert.rejects(
      util.frameworkVersionDir(dir, "3.0.0"),
      /Expected one version directory .* or one named 3\.0\.0\. Found: 1\.0\.0, 2\.0\.0/,
    );
  });

  it("throws when there is no real version directory", async () => {
    const dir = await versionsDir(tmp, []);
    await assert.rejects(util.frameworkVersionDir(dir, "1.0.0"), /Found: none/);
  });
});
