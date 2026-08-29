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

  it("downloads and verifies node headers when nativeAddon is enabled", async function () {
    if (!fs.existsSync("./cache/nw-headers-v0.107.0.tar.gz")) {
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
        nativeAddon: true,
        shaSum: true,
      });
    }

    /*
     * The file is saved under the same name SHASUMS256.txt lists it under
     * ("nw-headers-..." for this pre-0.111.3 version, not "node-..."), so
     * that verify() can actually find and check it - if verification had
     * silently found nothing, shaSum: true above would have thrown.
     */
    assert.strictEqual(
      fs.existsSync("./cache/nw-headers-v0.107.0.tar.gz"),
      true,
    );
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

  it("throws when downloadUrl file:/// path is a filesystem root", async function () {
    await assert.rejects(
      get({
        version: "0.107.0",
        flavor: "normal",
        platform: "linux",
        arch: "x64",
        downloadUrl: "file:///",
        manifestUrl: `file:///${process.cwd()}/tests/fixtures/main_manifest.json`,
        cacheDir: "./cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      }),
      /filesystem root/,
    );
  });

  it("throws when manifestUrl file:/// path is not valid JSON", async function () {
    await assert.rejects(
      get({
        version: "0.107.0",
        flavor: "normal",
        platform: "linux",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: `file:///${process.cwd()}/tests/fixtures/request_test.txt`,
        cacheDir: "./cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      }),
      /valid JSON/,
    );
  });
});
