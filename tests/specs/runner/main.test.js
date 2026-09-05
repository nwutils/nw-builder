import assert from "node:assert";
import path from "node:path";
import process from "node:process";
import { before, describe, it } from "node:test";

import get from "@nwutils/getter";
import run from "../../../packages/runner/src/main.js";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
const fixturesDir = path.join(repoRoot, "tests/fixtures/runner");

const PLATFORM_KV = {
  darwin: "osx",
  linux: "linux",
  win32: "win",
};

const ARCH_KV = {
  x64: "x64",
  ia32: "ia32",
  arm64: "arm64",
};

describe("runner test suite", async () => {
  const nwOptions = {
    srcDir: path.join(fixturesDir, "app"),
    mode: "build",
    version: "0.108.0",
    flavor: "sdk",
    platform: PLATFORM_KV[process.platform],
    arch: ARCH_KV[process.arch],
    downloadUrl: "https://dl.nwjs.io",
    manifestUrl: "https://nwjs.io/versions.json",
    outDir: path.join(fixturesDir, "out/app"),
    cacheDir: path.join(repoRoot, "packages/runner/cache/nw"),
    cache: true,
    ffmpeg: false,
    glob: false,
    managedManifest: false,
    nativeAddon: false,
    zip: false,
    shaSum: false,
    argv: [],
  };

  before(async () => {
    await get(nwOptions);
  }, Infinity);

  it(
    "runs and is killed via code",
    { skip: process.platform === "win32" },
    async () => {
      const nwProcess = await run(nwOptions);
      if (nwProcess) {
        nwProcess.kill();
        assert.strictEqual(nwProcess.killed, true);
      }
    },
  );
});
