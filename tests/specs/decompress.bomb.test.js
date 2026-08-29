import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import decompress from "../../src/decompress.js";
import { writeStoreZip } from "../fixtures/zip.js";

describe("decompress enforces bomb-protection limits (CWE-409)", function () {
  /**
   * @returns {{root: string, cacheDir: string}} - a fresh sandbox
   */
  function sandbox() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "getter-bomb-"));
    const cacheDir = path.join(root, "cache");
    fs.mkdirSync(cacheDir);
    return { root, cacheDir };
  }

  /*
   * The production default (200,000) can't be hit with a real, spec-valid
   * zip in a fast test: the classic (non-Zip64) end-of-central-directory
   * record can only declare up to 65,535 entries. `limits` exists so the
   * cap-exceeded mechanism can be proven with a small, cheap archive instead.
   */
  it("rejects an archive with more entries than maxEntries", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "many-entries.zip");
    writeStoreZip(
      zipPath,
      Array.from({ length: 5 }, (_, i) => ({
        name: `file-${i}.txt`,
        data: "x",
      })),
    );

    await assert.rejects(
      () => decompress(zipPath, cacheDir, { maxEntries: 3 }),
      /entry count exceeds the limit/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("rejects an archive whose extracted size exceeds maxTotalExtractedSize", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "large-entry.zip");
    writeStoreZip(zipPath, [{ name: "big.txt", data: "x".repeat(1024) }]);

    await assert.rejects(
      () =>
        decompress(zipPath, cacheDir, {
          maxEntries: 10,
          maxTotalExtractedSize: 100,
        }),
      /total extracted size exceeds the limit/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("still extracts a normal archive within the limits", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "ok.zip");
    writeStoreZip(zipPath, [{ name: "file.txt", data: "hello" }]);

    await decompress(zipPath, cacheDir, {
      maxEntries: 10,
      maxTotalExtractedSize: 1024,
    });
    assert.equal(
      fs.readFileSync(path.join(cacheDir, "file.txt"), "utf8"),
      "hello",
    );
    fs.rmSync(root, { recursive: true, force: true });
  });
});
