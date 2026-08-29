import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import verify from "../../src/verify.js";

/**
 * @returns {{root: string, cacheDir: string}} - a fresh sandbox
 */
function sandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "getter-verify-"));
  const cacheDir = path.join(root, "cache");
  fs.mkdirSync(cacheDir);
  return { root, cacheDir };
}

/**
 * @param  {string} content  - bytes to checksum
 * @returns {string}           - SHA256 hex digest of `content`
 */
function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

describe("verify", function () {
  /*
   * `shaOut` always already exists in these tests, so verify() never calls
   * request() - the "unused://" URL is never dereferenced.
   */

  it("resolves when expectedFile is present and matches", async function () {
    const { root, cacheDir } = sandbox();
    const fileContent = "hello world";
    fs.writeFileSync(path.join(cacheDir, "archive.zip"), fileContent);
    const shaOut = path.join(root, "SHASUMS256.txt");
    fs.writeFileSync(shaOut, `${sha256(fileContent)}  archive.zip\n`);

    const result = await verify(
      "unused://shaUrl",
      shaOut,
      cacheDir,
      false,
      true,
      "archive.zip",
    );
    assert.strictEqual(result, true);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("throws when expectedFile is missing from the SHASUMS listing and shaSum is true", async function () {
    const { root, cacheDir } = sandbox();
    fs.writeFileSync(path.join(cacheDir, "other.zip"), "data");
    const shaOut = path.join(root, "SHASUMS256.txt");
    fs.writeFileSync(shaOut, `${sha256("data")}  other.zip\n`);

    await assert.rejects(
      verify("unused://shaUrl", shaOut, cacheDir, false, true, "archive.zip"),
      /was not found or does not exist locally/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("throws when expectedFile is listed but does not exist locally", async function () {
    const { root, cacheDir } = sandbox();
    const shaOut = path.join(root, "SHASUMS256.txt");
    /* archive.zip is listed, but never written to cacheDir. */
    fs.writeFileSync(shaOut, `${sha256("data")}  archive.zip\n`);

    await assert.rejects(
      verify("unused://shaUrl", shaOut, cacheDir, false, true, "archive.zip"),
      /was not found or does not exist locally/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("warns instead of throwing when expectedFile is unverified and shaSum is false", async function () {
    const { root, cacheDir } = sandbox();
    const shaOut = path.join(root, "SHASUMS256.txt");
    fs.writeFileSync(shaOut, `${sha256("data")}  other.zip\n`);

    const result = await verify(
      "unused://shaUrl",
      shaOut,
      cacheDir,
      false,
      false,
      "archive.zip",
    );
    assert.strictEqual(result, true);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("does not require expectedFile to be provided", async function () {
    const { root, cacheDir } = sandbox();
    const shaOut = path.join(root, "SHASUMS256.txt");
    fs.writeFileSync(shaOut, `${sha256("data")}  other.zip\n`);

    const result = await verify(
      "unused://shaUrl",
      shaOut,
      cacheDir,
      false,
      true,
    );
    assert.strictEqual(result, true);
    fs.rmSync(root, { recursive: true, force: true });
  });
});
