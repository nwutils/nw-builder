import assert from "node:assert";
import path from "node:path";
import process from "node:process";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { beforeAll, describe, it } from "vitest";

import build from "../../src/bld.js";
import get from "../../src/get.js";
import util from "../../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("build", async () => {
  let driver = undefined;

  const nwOptions = {
    srcDir: "test/fixture/app",
    mode: "build",
    version: "0.83.0",
    flavor: "sdk",
    platform: util.PLATFORM_KV[process.platform],
    arch: util.ARCH_KV[process.arch],
    downloadUrl: "https://dl.nwjs.io",
    manifestUrl: "https://nwjs.io/versions",
    outDir: "test/fixture/out/app",
    cacheDir: "test/fixture/cache",
    cache: true,
    ffmpeg: false,
    glob: false,
    managedManifest: false,
    nativeAddon: false,
    zip: false,
    app: {
      name: "demo"
    }
  };

  beforeAll(async () => {
    await get({...nwOptions});
  }, Infinity);

  it("should build without errors", async () => {
    await build(nwOptions);
  });

  it.skip("should run after build", async () => {
    const options = new Options();
    const args = [
      `--nwapp=${path.resolve("test", "fixture", "app")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = util.getPath("chromedriver", nwOptions);
    // const chromedriverPath = path.resolve(nwOptions.outDir, "chromedriver");

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    assert.strictEqual(text, "Hello, World!");
  }, { timeout: Infinity });
});
