import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";

import decompress from "../../../packages/getter/src/decompress.js";
import get from "../../../packages/getter/src/main.js";

const cacheDir = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "packages",
  "getter",
  "cache",
);

describe("decompress test suite", function () {
  const platform =
    process.platform === "win32"
      ? "win"
      : process.platform === "darwin"
        ? "osx"
        : "linux";

  const nwFilePath = path.join(
    cacheDir,
    `nwjs-v0.107.0-${platform}-${process.arch}.${platform === "linux" ? "tar.gz" : "zip"}`,
  );
  const outFilePath = path.join(
    cacheDir,
    `nwjs-v0.107.0-${platform}-${process.arch}`,
  );

  before(async function () {
    fs.rmSync(outFilePath, { recursive: true, force: true });

    if (!fs.existsSync(nwFilePath)) {
      await get({
        version: "0.107.0",
        flavor: "normal",
        platform,
        arch: process.arch,
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions.json",
        cacheDir,
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      });
    }
  });

  it("decompresses a .zip file", async function () {
    await decompress(nwFilePath, cacheDir);
    assert.strictEqual(fs.existsSync(outFilePath), true);
  });

  it(
    "decompresses a .tar.gz file",
    { skip: platform !== "linux" },
    async function () {
      await decompress(nwFilePath, cacheDir);
      assert.strictEqual(fs.existsSync(outFilePath), true);
    },
  );
});
