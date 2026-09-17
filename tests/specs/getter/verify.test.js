import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import verify from "../../../packages/getter/src/verify.js";

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
      undefined,
      undefined,
      undefined,
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
      verify(
        "unused://shaUrl",
        shaOut,
        cacheDir,
        false,
        true,
        undefined,
        undefined,
        undefined,
        "archive.zip",
      ),
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
      verify(
        "unused://shaUrl",
        shaOut,
        cacheDir,
        false,
        true,
        undefined,
        undefined,
        undefined,
        "archive.zip",
      ),
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
      undefined,
      undefined,
      undefined,
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

describe("verify - community ffmpeg", function () {
  /*
   * When `ffmpeg` is true, `shaOut` is a JSON release manifest (as served by
   * the GitHub Releases API) rather than a plain-text SHASUMS256.txt, and
   * assets are matched by `${version}-${platform}-${arch}.zip` instead of by
   * a path relative to `cacheDir`.
   */

  /**
   * @param {string} storedSha - hex digest to embed in the manifest
   * @param {string} assetName - asset `name` field to embed in the manifest
   * @returns {string} - JSON text matching the GitHub release asset shape
   */
  function ffmpegManifest(storedSha, assetName) {
    return JSON.stringify({
      assets: [{ name: assetName, digest: `sha256:${storedSha}` }],
    });
  }

  it("resolves when the community ffmpeg archive is present and matches", async function () {
    const { root, cacheDir } = sandbox();
    const fileContent = "ffmpeg binary contents";
    fs.writeFileSync(
      path.join(cacheDir, "ffmpeg-0.1.0-linux-x64.zip"),
      fileContent,
    );
    const shaOut = path.join(root, "SHASUMS256.json");
    fs.writeFileSync(
      shaOut,
      ffmpegManifest(sha256(fileContent), "0.1.0-linux-x64.zip"),
    );

    const result = await verify(
      "unused://shaUrl",
      shaOut,
      cacheDir,
      true,
      true,
      "0.1.0",
      "linux",
      "x64",
      "ffmpeg-0.1.0-linux-x64.zip",
    );
    assert.strictEqual(result, true);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("throws when the community ffmpeg checksum does not match and shaSum is true", async function () {
    const { root, cacheDir } = sandbox();
    fs.writeFileSync(
      path.join(cacheDir, "ffmpeg-0.1.0-linux-x64.zip"),
      "actual contents",
    );
    const shaOut = path.join(root, "SHASUMS256.json");
    fs.writeFileSync(
      shaOut,
      ffmpegManifest(sha256("different contents"), "0.1.0-linux-x64.zip"),
    );

    await assert.rejects(
      verify(
        "unused://shaUrl",
        shaOut,
        cacheDir,
        true,
        true,
        "0.1.0",
        "linux",
        "x64",
        "ffmpeg-0.1.0-linux-x64.zip",
      ),
      /SHA256 checksums do not match/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("warns instead of throwing when the community ffmpeg checksum does not match and shaSum is false", async function () {
    const { root, cacheDir } = sandbox();
    fs.writeFileSync(
      path.join(cacheDir, "ffmpeg-0.1.0-linux-x64.zip"),
      "actual contents",
    );
    const shaOut = path.join(root, "SHASUMS256.json");
    fs.writeFileSync(
      shaOut,
      ffmpegManifest(sha256("different contents"), "0.1.0-linux-x64.zip"),
    );

    const result = await verify(
      "unused://shaUrl",
      shaOut,
      cacheDir,
      true,
      false,
      "0.1.0",
      "linux",
      "x64",
      "ffmpeg-0.1.0-linux-x64.zip",
    );
    assert.strictEqual(result, true);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("throws when no manifest asset matches version/platform/arch and shaSum is true", async function () {
    const { root, cacheDir } = sandbox();
    fs.writeFileSync(
      path.join(cacheDir, "ffmpeg-0.1.0-linux-x64.zip"),
      "actual contents",
    );
    const shaOut = path.join(root, "SHASUMS256.json");
    /* Manifest only lists a different platform's asset. */
    fs.writeFileSync(
      shaOut,
      ffmpegManifest(sha256("actual contents"), "0.1.0-osx-x64.zip"),
    );

    await assert.rejects(
      verify(
        "unused://shaUrl",
        shaOut,
        cacheDir,
        true,
        true,
        "0.1.0",
        "linux",
        "x64",
        "ffmpeg-0.1.0-linux-x64.zip",
      ),
      /was not found or does not exist locally/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("throws when the matching asset is listed but the archive does not exist locally", async function () {
    const { root, cacheDir } = sandbox();
    const shaOut = path.join(root, "SHASUMS256.json");
    /* Asset matches version/platform/arch, but the archive was never written. */
    fs.writeFileSync(
      shaOut,
      ffmpegManifest(sha256("actual contents"), "0.1.0-linux-x64.zip"),
    );

    await assert.rejects(
      verify(
        "unused://shaUrl",
        shaOut,
        cacheDir,
        true,
        true,
        "0.1.0",
        "linux",
        "x64",
        "ffmpeg-0.1.0-linux-x64.zip",
      ),
      /was not found or does not exist locally/,
    );
    fs.rmSync(root, { recursive: true, force: true });
  });
});
