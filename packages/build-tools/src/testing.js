import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";

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
 * @param {boolean} [options.headless] - Run headless; by default only in CI.
 *   Headless NW.js cancels file dialogs, so tests of them need a display
 *   (xvfb-run in CI).
 * @param {Record<string, string>} [options.env] - Extra environment variables
 *   for NW.js, e.g. from `fileChooserPortal()`.
 * @returns {Promise<selenium.WebDriver>} The session; call `quit()` when done.
 */
export async function launch(
  app,
  { args = [], headless = Boolean(process.env.CI), env = {} } = {},
) {
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
  if (headless) {
    seleniumArguments.push("headless=new");
  }
  options.addArguments(...seleniumArguments);
  options.setChromeBinaryPath(nw);

  return new selenium.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(
      // chromedriver passes its environment on to NW.js.
      new chrome.ServiceBuilder(chromedriver).setEnvironment(
        /** @type {Record<string, string>} */ ({ ...process.env, ...env }),
      ),
    )
    .build();
}

/**
 * Starts a stand-in for the desktop portal's file chooser, which NW.js on
 * Linux shows file dialogs through: a private D-Bus session bus with
 * src/file_chooser_portal.py on it, which answers every file dialog at once
 * with `paths`, as if the user picked them. Pass `env` to `launch()`. Needs
 * dbus-daemon and Python with PyGObject (`PYTHON`, default python3).
 *
 * @param {string[]} paths - Files or folders every dialog picks.
 * @returns {Promise<FileChooserPortal>} The running portal.
 */
export async function fileChooserPortal(paths) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nwjs-portal-"));
  /** @type {child_process.ChildProcess[]} */
  const children = [];
  const close = async () => {
    for (const child of children.reverse()) {
      child.kill();
    }
    fs.rmSync(dir, { recursive: true, force: true });
  };

  try {
    const bus = child_process.spawn(
      "dbus-daemon",
      [
        "--session",
        "--nofork",
        "--print-address=1",
        `--address=unix:path=${path.join(dir, "bus")}`,
      ],
      { stdio: ["ignore", "pipe", "inherit"] },
    );
    children.push(bus);
    const address = await firstLine(bus, () => true);
    const env = { DBUS_SESSION_BUS_ADDRESS: address };

    const portal = child_process.spawn(
      process.env.PYTHON ?? "python3",
      [path.join(import.meta.dirname, "file_chooser_portal.py"), ...paths],
      {
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "inherit"],
      },
    );
    children.push(portal);
    /** @type {FileChooserRequest[]} */
    const requests = [];
    await firstLine(portal, (line) => {
      if (line === "ready") {
        return true;
      }
      requests.push(JSON.parse(line));
      return false;
    });
    return { env, requests, close };
  } catch (error) {
    await close();
    throw error;
  }
}

/**
 * @typedef {object} FileChooserRequest
 * @property {string} method - OpenFile or SaveFile.
 * @property {string} title - The dialog's title.
 * @property {Record<string, boolean | string>} options - Its boolean and
 *   string options, e.g. `directory` for a folder dialog.
 */

/**
 * @typedef {object} FileChooserPortal
 * @property {Record<string, string>} env - Environment for `launch()`.
 * @property {FileChooserRequest[]} requests - Dialogs shown so far.
 * @property {() => Promise<void>} close - Stops the portal and its bus.
 */

/**
 * Feeds a child's stdout lines to `onLine` until it returns true.
 *
 * @param {child_process.ChildProcess} child - Process with piped stdout.
 * @param {(line: string) => boolean} onLine - Returns true when done waiting.
 * @returns {Promise<string>} The line `onLine` returned true for.
 */
function firstLine(child, onLine) {
  return new Promise((resolve, reject) => {
    let done = false;
    const lines = readline.createInterface({
      input: /** @type {import("node:stream").Readable} */ (child.stdout),
    });
    lines.on("line", (line) => {
      if (done) {
        onLine(line);
      } else if (onLine(line)) {
        done = true;
        resolve(line);
      }
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (!done) {
        reject(
          new Error(`${child.spawnfile} exited (${code}) before starting`),
        );
      }
    });
  });
}
