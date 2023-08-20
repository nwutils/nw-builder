import { equal } from "node:assert";
import { resolve } from "node:path";
import {arch as ARCH, platform as PLATFORM} from "node:process";
import { describe, it } from "node:test";

import NwBuilder from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import { ARCH_KV, PLATFORM_KV } from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("test modes", async () => {
  let driver = undefined;

  let nwOptions = {
    files: "test/demo/**",
    version: "0.67.1",
    flavor: "sdk",
    cacheDir: "cache",
  };

  it("should run", async () => {
    const nw =  NwBuilder({ ...nwOptions });

    nw.build();

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "demo")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = resolve(
      nwOptions.cacheDir,
      `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${
        PLATFORM_KV[PLATFORM]
      }-${ARCH_KV[ARCH]}`,
      `chromedriver${PLATFORM_KV[PLATFORM] === "win" ? ".exe" : ""}`,
    );

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "Hello, World!");
  });
});
