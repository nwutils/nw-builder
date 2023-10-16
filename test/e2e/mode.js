import { equal } from "node:assert";
import { arch, platform } from "node:process";
import { basename, resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import { ARCH_KV, PLATFORM_KV } from "../../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("test modes", async () => {
  let driver = undefined;

  let nwOptions = {};

  it("runs application", async () => {
    await nwbuild({
      srcDir: "test/fixture/app",
      mode: "build",
      version: "0.80.0",
      flavor: "sdk",
      platform: PLATFORM_KV[platform],
      arch: ARCH_KV[arch],
      outDir: "test/fixture/out",
      cacheDir: "test/fixture/cache",
      glob: false,
    });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "fixture", "app")}`,
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

  it("renames MacOS Helper Apps", async () => {
    if (PLATFORM_KV[platform] === "darwin") {
      await nwbuild({
        srcDir: "test/fixture/app",
        mode: "build",
        version: "0.80.0",
        platform: PLATFORM_KV[platform],
        arch: ARCH_KV[arch],
        outDir: "test/fixture/out",
        cacheDir: "test/fixture/cache",
        glob: false,
        app: {
          name: "demo",
          icon: "app/icon.icns",
          CFBundleIdentifier: "io.nwutils.demo",
          CFBundleName: "demo",
          CFBundleDisplayName: "demo",
          CFBundleVersion: "0.0.0",
          CFBundleShortVersionString: "0.0.0",
          NSHumanReadableCopyright: "Copyright (c) 2023 NW.js Utilities",
        },
      });

      const appName = basename(
        resolve(nwOptions.outDir, `${nwOptions.app.name}.app`),
      );
      equal(appName, "demo.app");
    }
  });
});
