import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import { frameworkVersionDir } from "../../../packages/getter/src/main.js";

describe("getter frameworkVersionDir", () => {
  let tmp = "";

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwget-fw-"));
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  it("finds the real version directory, not the Current symbolic link", async () => {
    const dir = path.join(tmp, "one");
    await fs.promises.mkdir(path.join(dir, "150.0.7871.0"), {
      recursive: true,
    });
    /* A junction needs no extra privileges on Windows. */
    await fs.promises.symlink(
      path.join(dir, "150.0.7871.0"),
      path.join(dir, "Current"),
      process.platform === "win32" ? "junction" : "dir",
    );
    assert.equal(
      await frameworkVersionDir(dir),
      path.join(dir, "150.0.7871.0"),
    );
  });

  it("throws unless there is exactly one version directory", async () => {
    const dir = path.join(tmp, "two");
    await fs.promises.mkdir(path.join(dir, "1.0.0"), { recursive: true });
    await fs.promises.mkdir(path.join(dir, "2.0.0"), { recursive: true });
    await assert.rejects(
      frameworkVersionDir(dir),
      /Expected one version directory .* Found: 1\.0\.0, 2\.0\.0/,
    );
  });
});
