import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import util from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("node native addon", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/gyp",
    mode: "build",
    version: "0.82.0",
    flavor: "sdk",
    platform: util.PLATFORM_KV[platform],
    arch: util.ARCH_KV[arch],
    outDir: "test/fixture/out/gyp",
    cacheDir: "test/fixture/cache",
    glob: false,
    nativeAddon: "gyp",
  };

  it("builds native addon and executes", async () => {
    await nwbuild({ ...nwOptions });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "gyp", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = util.getPath("chromedriver", nwOptions);

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "world");
  });
});
