import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import nwbuild from "../src/index.js";
import util from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("test modes", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/app",
    mode: "build",
    version: "0.83.0",
    flavor: "sdk",
    platform: util.PLATFORM_KV[platform],
    arch: util.ARCH_KV[arch],
    outDir: "test/fixture/out/app",
    cacheDir: "test/fixture/cache",
    glob: false,
    nativeAddon: false,
  };

  before(async () => {
    await nwbuild({ ...nwOptions });
  });

  it("should run", async () => {
    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "app", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = util.getPath("chromedriver", nwOptions);

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "Hello, World!");
  });
});
