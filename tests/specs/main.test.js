import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import get from "../../src/main.js";

describe("getter test suite", function () {
  it("downloads a file from a test server", async function () {
    if (!fs.existsSync("./cache/nwjs-v0.107.0-linux-x64")) {
      await get({
        version: "0.107.0",
        flavor: "normal",
        platform: "linux",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions.json",
        cacheDir: "./cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      });
    }

    assert.strictEqual(fs.existsSync("./cache/nwjs-v0.107.0-linux-x64"), true);
  });

  it("parses manifestUrl file:/// path correctly", async function () {
    await get({
      version: "0.107.0",
      flavor: "normal",
      platform: "linux",
      arch: "x64",
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: `file:///${process.cwd()}/tests/fixtures/main_manifest.json`,
      cacheDir: "./cache",
      cache: true,
      ffmpeg: false,
      nativeAddon: false,
      shaSum: true,
    });
    const localManifestFile = JSON.parse(
      await fs.promises.readFile(
        `${process.cwd()}/cache/manifest.json`,
        "utf-8",
      ),
    );
    assert.strictEqual(localManifestFile.latest, "v0.106.1");
  });
});
