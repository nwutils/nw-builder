import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import build from "@nwutils/builder";
import get from "@nwutils/getter";

import appImage from "../../../packages/packager/src/appImage.js";
import util from "../../../packages/nw-builder/src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

/*
 * Unlike appImage.test.js (fake app + fake appimagetool, no network), this
 * builds a real NW.js application, packages it with the real `appimagetool`,
 * and checks the resulting .AppImage both runs and renders. That means a real
 * download of the NW.js SDK build (~150-200MB, needed for its bundled
 * `chromedriver`) and of `appimagetool` on first run, so it's run through its
 * own "test:real" script rather than the default "test" script, and only on
 * Linux CI runners - see .github/workflows/ci-packager.yml.
 */
describe(
  "packager/appImage real app test suite",
  { skip: process.platform !== "linux" },
  async () => {
    const cacheDir = path.join(repoRoot, "tests/fixtures/packager/cache");
    const outDir = path.join(repoRoot, "tests/fixtures/packager/out/Demo");
    const distDir = path.join(repoRoot, "tests/fixtures/packager/dist");

    const nwOptions = {
      version: "0.115.0",
      flavor: "sdk",
      platform: util.PLATFORM_KV[process.platform],
      arch: util.ARCH_KV[process.arch],
      downloadUrl: "https://dl.nwjs.io",
      manifestUrl: "https://nwjs.io/versions.json",
      cacheDir,
      cache: true,
      ffmpeg: false,
      nativeAddon: false,
      shaSum: true,
    };

    let appImagePath;
    let driver;

    before(async () => {
      await get(nwOptions);

      await build({
        ...nwOptions,
        srcDir: path.join(repoRoot, "tests/fixtures/packager/real-app"),
        outDir,
        app: {
          name: "Demo",
          icon: "icon.png",
          categories: "Utility;",
        },
        glob: false,
        managedManifest: false,
        zip: false,
        releaseInfo: {},
      });

      appImagePath = await appImage({
        appDir: outDir,
        appName: "Demo",
        cacheDir,
        outDir: distDir,
      });
    });

    after(async () => {
      if (driver !== undefined) {
        await driver.quit();
      }
      await fs.promises.rm(path.join(repoRoot, "tests/fixtures/packager/out"), {
        recursive: true,
        force: true,
      });
      await fs.promises.rm(distDir, { recursive: true, force: true });
    });

    it("produces a real .AppImage file", async () => {
      assert.ok(fs.existsSync(appImagePath));
      const magic = await fs.promises.readFile(appImagePath);
      assert.strictEqual(magic.subarray(0, 4).toString("hex"), "7f454c46");
    });

    it("runs without crashing", async () => {
      const userDataDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-real-appimage-"),
      );

      const child = child_process.spawn(
        appImagePath,
        ["--headless=new", "--no-sandbox", `--user-data-dir=${userDataDir}`],
        {
          env: { ...process.env, APPIMAGE_EXTRACT_AND_RUN: "1" },
          stdio: "ignore",
        },
      );

      try {
        const stillRunning = await new Promise((resolve) => {
          child.once("exit", () => resolve(false));
          setTimeout(() => resolve(true), 5000);
        });
        assert.strictEqual(stillRunning, true, "AppImage exited unexpectedly");
      } finally {
        /*
         * The AppImage runtime extracts itself and NW.js forks a zygote, GPU
         * and renderer processes, none of which share this process's group -
         * killing `child` alone leaves them running. Every one of them carries
         * this run's unique --user-data-dir in its argv, so match on that
         * instead to reap the whole tree.
         */
        child.kill("SIGKILL");
        child_process.spawnSync("pkill", ["-9", "-f", userDataDir]);
        await fs.promises.rm(userDataDir, { recursive: true, force: true });
      }
    });

    it('displays "Demo"', async () => {
      /*
       * NW.js's remote-debugging/DevTools server only activates through the
       * `--nwapp=` flag on its own (unrenamed) `nw` binary - confirmed by
       * hand: a packaged/renamed executable, including the one inside the
       * .AppImage above, never opens a debugging port no matter which
       * --remote-debugging-port is passed. So this drives the exact
       * package.nw content that was copied byte-for-byte into the AppImage,
       * through the officially supported --nwapp= + chromedriver pattern (see
       * tests/specs/builder/bld.test.js), rather than the .AppImage itself.
       */
      const chromedriverPath = await util.getPath("chromedriver", nwOptions);
      const options = new Options();
      options.addArguments([
        `--nwapp=${path.join(outDir, "package.nw")}`,
        "--headless=new",
        "--no-sandbox",
      ]);
      const service = new ServiceBuilder(chromedriverPath).build();

      driver = Driver.createSession(options, service);
      const text = await driver.findElement(By.id("test")).getText();
      assert.strictEqual(text, "Demo");
    });
  },
);
