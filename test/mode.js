import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import util from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("test modes", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/app",
    mode: "build",
    version: "0.82.0",
    flavor: "sdk",
    platform: util.PLATFORM_KV[platform],
    arch: util.ARCH_KV[arch],
    outDir: "test/fixture/out/app",
    cacheDir: "test/fixture/cache",
    glob: false,
  };

  it("should run", async () => {
    await nwbuild({ ...nwOptions });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "app", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = resolve(
      nwOptions.cacheDir,
      `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${
        nwOptions.platform
      }-${nwOptions.arch}`,
      `chromedriver${nwOptions.platform === "win" ? ".exe" : ""}`,
    );

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "Hello, World!");
  });
});
