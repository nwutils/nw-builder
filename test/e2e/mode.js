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

/**
 * Test modes
 */
export function mode() {
  describe("test modes", async () => {
    let driver = undefined;

    let nwOptions = {
      srcDir: "test/fixture/app/**/*",
      mode: "build",
      version: "0.77.0",
      flavor: "sdk",
      platform: getPlatform(platform),
      arch: getArch(arch),
      outDir: "test/fixture/out",
      cacheDir: "test/fixture/tmp",
    };

    it("should run", async () => {

      await nwbuild({ ...nwOptions });

      const options = new Options();
      const args = [
        `--nwapp=${resolve("test", "fixture", "app")}`,
        "--headless=new",
      ];
      options.addArguments(args);

      const chromedriverPath = resolve(
        nwOptions.cacheDir,
        `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version
        }-${nwOptions.platform}-${nwOptions.arch}`,
        `chromedriver${nwOptions.platform === "win" ? ".exe" : ""}`
      );

      const service = new ServiceBuilder(chromedriverPath).build();

      driver = Driver.createSession(options, service);
      const text = await driver.findElement(By.id("test")).getText();
      equal(text, "Hello, World!");
    });
  });
}
