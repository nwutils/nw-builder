import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import { getArch } from "../../src/util/arch.js";
import { getPlatform } from "../../src/util/platform.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("node native addon", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/gyp",
    mode: "build",
    version: "0.81.0",
    flavor: "sdk",
    platform: getPlatform(platform),
    arch: getArch(arch),
    outDir: "test/fixture/out/gyp",
    cacheDir: "test/fixture/cache",
    glob: false,
    nativeAddon: true,
  };

  it("builds native addon and executes", async () => {
    await nwbuild({ ...nwOptions });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "gyp", "package.nw")}`,
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
    equal(text, "world");
  });
});
