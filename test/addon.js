import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import nwbuild from "../src/index.js";
import util from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("node native addon", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/gyp",
    mode: "build",
    version: "0.83.0",
    flavor: "sdk",
    platform: util.PLATFORM_KV[platform],
    arch: util.ARCH_KV[arch],
    outDir: "test/fixture/out/gyp",
    cacheDir: "test/fixture/cache",
    glob: false,
    nativeAddon: "gyp",
  };

  before(async () => {
    await nwbuild({ ...nwOptions });
  });

  it("builds gyp native addon and executes", async () => {
    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "gyp", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromeDriverPath = util.getPath("chromedriver", nwOptions);

    const service = new ServiceBuilder(chromeDriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "world");
  });

  it("builds nan native addon and executes", async () => {
    nwOptions.srcDir = "test/fixture/nan";
    nwOptions.outDir = "test/fixture/out/nan";
    
    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "nan", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromeDriverPath = util.getPath("chromedriver", nwOptions);

    const service = new ServiceBuilder(chromeDriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "world");
  });
});
