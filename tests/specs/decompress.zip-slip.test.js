import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import decompress from "../../src/decompress.js";
import { writeStoreZip } from "../fixtures/zip.js";

describe("decompress refuses to write outside the destination", function () {
  /**
   * @returns {{root: string, cacheDir: string, outside: string}} - a fresh sandbox
   */
  function sandbox() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "getter-zip-slip-"));
    const cacheDir = path.join(root, "cache");
    fs.mkdirSync(cacheDir);
    return { root, cacheDir, outside: path.join(root, "outside.txt") };
  }

  /*
   * Entry NAMES are already refused by yauzl-promise itself, which throws
   * "Relative path: ../outside.txt" before this module sees the entry. These
   * two cases therefore lock in behaviour we inherit rather than behaviour we
   * added - worth keeping so a future zip backend swap cannot quietly drop it.
   */
  it("rejects an entry whose name escapes with ..", async function () {
    const { root, cacheDir, outside } = sandbox();
    const zipPath = path.join(root, "evil.zip");
    writeStoreZip(zipPath, [{ name: "../outside.txt", data: "pwned" }]);

    await assert.rejects(() => decompress(zipPath, cacheDir));
    assert.equal(
      fs.existsSync(outside),
      false,
      "a ../ entry must not be written outside cacheDir",
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("rejects an absolute entry name", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "abs.zip");
    const absTarget = path.join(root, "abs-outside.txt");
    writeStoreZip(zipPath, [{ name: absTarget, data: "pwned" }]);

    await assert.rejects(() => decompress(zipPath, cacheDir));
    assert.equal(fs.existsSync(absTarget), false);
    fs.rmSync(root, { recursive: true, force: true });
  });

  /*
   * This is the case nothing was guarding. yauzl validates the entry name, so
   * `link` itself is fine - but the link TARGET is archive data too, and
   * fs.symlink writes it verbatim. The link lands inside cacheDir pointing out
   * of it, and anything later written through it escapes.
   */
  it("rejects a symlink whose target escapes", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "link.zip");
    writeStoreZip(zipPath, [
      { name: "link", data: "../outside.txt", mode: 0o120777 },
    ]);

    await assert.rejects(
      () => decompress(zipPath, cacheDir),
      /resolves outside the destination directory/,
    );
    assert.equal(fs.existsSync(path.join(cacheDir, "link")), false);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("still extracts an ordinary entry", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "ok.zip");
    writeStoreZip(zipPath, [{ name: "nested/file.txt", data: "hello" }]);

    await decompress(zipPath, cacheDir);
    assert.equal(
      fs.readFileSync(path.join(cacheDir, "nested", "file.txt"), "utf8"),
      "hello",
    );
    fs.rmSync(root, { recursive: true, force: true });
  });
});
