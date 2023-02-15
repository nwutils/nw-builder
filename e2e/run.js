import { equal } from "node:assert";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("run mode", async () => {

    let driver = undefined;

    let nwOptions = {
        srcDir: "./e2e/app/*",
        mode: "build",
        version: "0.72.0",
        flavor: "sdk",
        platform: "linux",
        arch: "x64",
        outDir: "./e2e/out",
        cacheDir: "./e2e/tmp"
    };

    // before(async () => {});

    it("should run", async () => {
        await nwbuild({ ...nwOptions })

        const options = new Options();
        const args = [
            `nwapp=./e2e/app`,
            "--headless=new",
        ]
        options.addArguments(args);

        const nwDir = `${nwOptions.cacheDir}/nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""
            }-v${nwOptions.version}-${nwOptions.platform}-${nwOptions.arch}`;

        const service = new ServiceBuilder(
            resolve(`${nwDir}/chromedriver`)
        ).build();

        driver = Driver.createSession(options, service);
        const text = await driver.findElement(By.id("test")).getText();
        equal(text, "Hello, World!");
    });
});
