import child_process from "node:child_process";
import { once } from "node:events";
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
 * Linux shows file dialogs through: src/file_chooser_portal.py on a private
 * D-Bus session bus, answering every file dialog at once with `paths`, as if
 * the user picked them. Pass `env` to `launch()`. Needs dbus-run-session and
 * Python with PyGObject (`PYTHON`, default python3).
 *
 * @param {string[]} paths - Files or folders every dialog picks.
 * @returns {Promise<{ env: Record<string, string>, close: () => void }>}
 *   Environment for `launch()`, and a function that stops the portal.
 */
export async function fileChooserPortal(paths) {
  const portal = child_process.spawn(
    "dbus-run-session",
    [
      "--",
      process.env.PYTHON ?? "python3",
      path.join(import.meta.dirname, "file_chooser_portal.py"),
      ...paths,
    ],
    // Its own process group, so close() stops the bus and the portal.
    { detached: true, stdio: ["ignore", "pipe", "inherit"] },
  );
  const close = () => {
    try {
      process.kill(-(portal.pid ?? 0));
    } catch {
      // Already gone.
    }
  };
  /* It prints the bus's address once it's up. */
  const [address] = await Promise.race([
    once(readline.createInterface({ input: portal.stdout }), "line"),
    once(portal, "exit").then(([code]) => {
      throw new Error(
        `file_chooser_portal.py exited (${code}) before starting`,
      );
    }),
  ]).catch((error) => {
    close();
    throw error;
  });
  return { env: { DBUS_SESSION_BUS_ADDRESS: address }, close };
}

/**
 * @typedef {object} WaylandIconRequest
 * @property {"create_icon" | "add_buffer" | "set_icon"} request - The request.
 * @property {number} icon - The icon object (0 when set_icon clears it).
 * @property {number} [width] - add_buffer: the buffer's width in pixels.
 * @property {number} [height] - add_buffer: the buffer's height in pixels.
 * @property {number} [scale] - add_buffer: the scale it's for.
 */

/**
 * Starts a headless Wayland session that records window icons: weston, behind
 * src/wayland_icon_proxy.py, which adds the window icon protocol
 * (xdg_toplevel_icon_manager_v1) weston lacks and records the icon requests
 * NW.js sends. Pass `env` and `args` to `launch()` with `headless: false`.
 * Needs weston and Python.
 *
 * @returns {Promise<{ env: Record<string, string>, args: string[], requests: WaylandIconRequest[], close: () => void }>}
 *   Environment and switches for `launch()`, the icon requests so far, and a
 *   function that stops the session.
 */
export async function waylandIconSession() {
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "nwjs-wayland-"));
  fs.chmodSync(runtimeDir, 0o700);
  const env = { ...process.env, XDG_RUNTIME_DIR: runtimeDir };
  /** @type {child_process.ChildProcess[]} */
  const children = [];
  const close = () => {
    for (const child of children) {
      child.kill();
    }
    fs.rmSync(runtimeDir, { recursive: true, force: true });
  };

  try {
    const weston = child_process.spawn(
      "weston",
      ["--backend=headless", "--socket=wl-compositor", "--idle-time=0"],
      { env, stdio: "ignore" },
    );
    children.push(weston);
    const compositor = path.join(runtimeDir, "wl-compositor");
    for (let i = 0; !fs.existsSync(compositor); i++) {
      if (i === 100 || weston.exitCode !== null) {
        throw new Error("weston didn't start");
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const proxy = child_process.spawn(
      process.env.PYTHON ?? "python3",
      [
        path.join(import.meta.dirname, "wayland_icon_proxy.py"),
        path.join(runtimeDir, "wl-proxy"),
        compositor,
      ],
      { env, stdio: ["ignore", "pipe", "inherit"] },
    );
    children.push(proxy);
    /** @type {WaylandIconRequest[]} */
    const requests = [];
    const lines = readline.createInterface({
      input: /** @type {import("node:stream").Readable} */ (proxy.stdout),
    });
    /* It prints "ready" once it listens, then a JSON line per icon request. */
    await Promise.race([
      new Promise((resolve) =>
        lines.on("line", (line) => {
          if (line === "ready") {
            resolve(undefined);
          } else {
            requests.push(JSON.parse(line));
          }
        }),
      ),
      once(proxy, "exit").then(([code]) => {
        throw new Error(
          `wayland_icon_proxy.py exited (${code}) before starting`,
        );
      }),
    ]);

    return {
      env: { XDG_RUNTIME_DIR: runtimeDir, WAYLAND_DISPLAY: "wl-proxy" },
      args: ["ozone-platform=wayland"],
      requests,
      close,
    };
  } catch (error) {
    close();
    throw error;
  }
}
