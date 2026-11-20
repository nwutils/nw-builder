import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import selenium from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

/**
 * The SDK build under test: NWJS_SDK_DIR, which `build-tools test` sets to the
 * extracted release (or --nwdir).
 *
 * @returns {string} Directory holding `nw` and `chromedriver`.
 */
export function sdkDir() {
  const dir = process.env.NWJS_SDK_DIR;
  if (!dir) {
    throw new Error(
      "NWJS_SDK_DIR is not set; run issue tests with `build-tools test`",
    );
  }
  return dir;
}

/**
 * Starts an NW.js app with Selenium's Builder API, as in
 * https://github.com/nwutils/nw-testing-javascript-selenium-builder-example:
 * Chrome options with `nwapp=<app>` (headless in CI) and the SDK's `nw` as the
 * browser binary. The session uses the SDK's own chromedriver, through
 * ServiceBuilder, so the build under test is driven by its matching driver.
 *
 * @param {string} app - Directory of the NW.js app (holding package.json).
 * @param {object} [options]
 * @param {string[]} [options.args] - Extra command line arguments for NW.js.
 * @returns {Promise<selenium.WebDriver>} The session; call `quit()` when done.
 */
export async function launch(app, { args = [] } = {}) {
  const dir = sdkDir();
  const nw = path.join(dir, "nw");
  const chromedriver = path.join(dir, "chromedriver");
  if (!fs.existsSync(nw) || !fs.existsSync(chromedriver)) {
    throw new Error(
      `${dir} needs nw and chromedriver; issue tests need the SDK build`,
    );
  }

  const options = new chrome.Options();
  const seleniumArguments = [`nwapp=${path.resolve(app)}`, ...args];
  /* Run in headless mode when in CI environment. */
  if (process.env.CI) {
    seleniumArguments.push("headless=new");
  }
  options.addArguments(...seleniumArguments);
  options.setChromeBinaryPath(nw);

  return new selenium.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromedriver))
    .build();
}
