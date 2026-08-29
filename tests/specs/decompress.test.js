import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";

import decompress from "../../src/decompress.js";

describe("decompress test suite", function () {
  const platform =
    process.platform === "win32"
      ? "win"
      : process.platform === "darwin"
        ? "osx"
        : "linux";

  const nwFilePath = path.resolve(
    "cache",
    `nwjs-v0.107.0-${platform}-${process.arch}.${platform === "linux" ? "tar.gz" : "zip"}`,
  );
  const outFilePath = path.resolve(
    "cache",
    `nwjs-v0.107.0-${platform}-${process.arch}`,
  );

  before(function () {
    fs.rmSync(outFilePath, { recursive: true, force: true });
  });

  it("decompresses a .zip file", async function () {
    await decompress(nwFilePath, path.resolve("cache"));
    assert.strictEqual(fs.existsSync(outFilePath), true);
  });

  it(
    "decompresses a .tar.gz file",
    { skip: platform !== "linux" },
    async function () {
      await decompress(nwFilePath, path.resolve("cache"));
      assert.strictEqual(fs.existsSync(outFilePath), true);
    },
  );
});
