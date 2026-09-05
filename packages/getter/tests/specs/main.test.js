import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import get from "../../src/main.js";

const packageRoot = path.resolve(import.meta.dirname, "..", "..");
const cacheDir = path.join(packageRoot, "cache");

describe("getter test suite", function () {
  it("downloads a file from a test server", async function () {
    const nwArchivePath = path.join(cacheDir, "nwjs-v0.107.0-linux-x64");
    if (!fs.existsSync(nwArchivePath)) {
      await get({
        version: "0.107.0",
        flavor: "normal",
        platform: "linux",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions.json",
        cacheDir,
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      });
    }

    assert.strictEqual(fs.existsSync(nwArchivePath), true);
  });

  it("downloads and verifies node headers when nativeAddon is enabled", async function () {
    const headersPath = path.join(cacheDir, "nw-headers-v0.107.0.tar.gz");
    if (!fs.existsSync(headersPath)) {
      await get({
        version: "0.107.0",
        flavor: "normal",
        platform: "linux",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions.json",
        cacheDir,
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
    assert.strictEqual(fs.existsSync(headersPath), true);
  });

  it("parses manifestUrl file:/// path correctly", async function () {
    await get({
      version: "0.107.0",
      flavor: "normal",
      platform: "linux",
      arch: "x64",
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: `file:///${path.join(packageRoot, "tests/fixtures/main_manifest.json")}`,
      cacheDir,
      cache: true,
      ffmpeg: false,
      nativeAddon: false,
      shaSum: true,
    });
    const localManifestFile = JSON.parse(
      await fs.promises.readFile(
        path.join(cacheDir, "manifest.json"),
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
        manifestUrl: `file:///${path.join(packageRoot, "tests/fixtures/main_manifest.json")}`,
        cacheDir,
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
        manifestUrl: `file:///${path.join(packageRoot, "tests/fixtures/request_test.txt")}`,
        cacheDir,
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      }),
      /valid JSON/,
    );
  });
});
