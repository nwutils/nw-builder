import { equal } from "node:assert";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import selenium from "selenium-webdriver";

import { launch } from "../../src/testing.js";

/*
 * Copy this folder to issues/<issue number>, reproduce the issue in app/ and
 * assert the fixed behaviour here. `build-tools test --issue <number>` runs it
 * against the NW.js SDK built with the issue's patches.
 */
describe("nwjs/nw.js#0000: <issue title>", () => {
  /** @type {selenium.WebDriver | undefined} */
  let driver = undefined;

  /* Start the issue's app in the NW.js build under test. */
  before(async () => {
    driver = await launch(path.join(import.meta.dirname, "app"));
  });

  /**
   * Get text via element's ID and assert it is equal.
   */
  it("Hello, World! text by ID", { timeout: 30000 }, async () => {
    const textElement = await driver?.findElement(selenium.By.id("test"));
    const text = await textElement?.getText();
    equal(text, "Hello, World!");
  });

  /**
   * Quit Selenium driver.
   */
  after(async () => {
    await driver?.quit();
  });
});
