import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "../src/index.js";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("bld", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/fixture/app",
    mode: "build",
    version: "0.83.0",
    flavor: "sdk",
    platform: "win",
    arch: "x64",
    outDir: "test/fixture/out/app",
    cacheDir: "test/fixture/cache",
    glob: false,
    app: {
        icon: "icon.ico"
    }
  };

  it("should build and run", async () => {
    await nwbuild({ ...nwOptions });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "out", "app", "package.nw")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = resolve(
      nwOptions.cacheDir,
      `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${nwOptions.platform
      }-${nwOptions.arch}`,
      `chromedriver${nwOptions.platform === "win" ? ".exe" : ""}`,
    );

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "Hello, World!");
  });
});
