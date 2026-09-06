import assert from "node:assert/strict";
import path from "node:path";
import process from "node:process";
import { before, describe, it } from "node:test";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import build from "../../../packages/nw-builder/src/bld.js";
import get from "@nwutils/getter";
import util from "../../../packages/nw-builder/src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

describe.skip("bld test suite", async () => {
  let driver = undefined;

  const nwOptions = {
    srcDir: path.join(repoRoot, "tests/fixtures/nw-builder/app"),
    mode: "build",
    version: "latest",
    flavor: "sdk",
    platform: util.PLATFORM_KV[process.platform],
    arch: util.ARCH_KV[process.arch],
    downloadUrl: "https://dl.nwjs.io",
    manifestUrl: "https://nwjs.io/versions.json",
    outDir: path.join(repoRoot, "tests/fixtures/nw-builder/out/app"),
    cacheDir: path.join(repoRoot, "node_modules/nw"),
    cache: true,
    ffmpeg: false,
    glob: false,
    managedManifest: false,
    nativeAddon: false,
    zip: false,
  };

  before(async () => {
    await get(nwOptions);
  });

  it("builds without errors", async () => {
    await build(nwOptions);
  });

  it("runs after build", async () => {
    const options = new Options();
    const args = [
      `--nwapp=${path.resolve("test", "fixture", "app")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = util.getPath("chromedriver", nwOptions);

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    assert.strictEqual(text, "Hello, World!");
  });
});
