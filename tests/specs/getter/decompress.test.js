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

describe("decompress test suite", async function () {
  const platform =
    process.platform === "win32"
      ? "win"
      : process.platform === "darwin"
        ? "osx"
        : "linux";

  const manifest = await fetch("https://nwjs.io/versions.json").then((res) =>
    res.json(),
  );
  const version = manifest.latest.slice(1);

  const nwFilePath = path.join(
    cacheDir,
    `nwjs-v${version}-${platform}-${process.arch}.${platform === "linux" ? "tar.gz" : "zip"}`,
  );
  const outFilePath = path.join(
    cacheDir,
    `nwjs-v${version}-${platform}-${process.arch}`,
  );

  before(async function () {
    fs.rmSync(outFilePath, { recursive: true, force: true });

    if (!fs.existsSync(nwFilePath)) {
      await get({
        version,
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

    /*
     * get() already extracts nwFilePath as part of its own pipeline (it
     * calls decompress() internally), which the tests below don't need -
     * they call decompress() themselves. Some archive entries (e.g. a
     * read-only gpu_shader_cache.bin in NW.js's macOS build) get chmod'd
     * non-writable on that first extraction, so re-extracting on top of it
     * without clearing it first fails with EACCES on the second write.
     */
    fs.rmSync(outFilePath, { recursive: true, force: true });
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
