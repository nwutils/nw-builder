import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import get from "@nwutils/getter";

import build from "../../../packages/builder/src/main.js";
import util from "../../../packages/nw-builder/src/util.js";
import {
  prepareDeepLinkApp,
  waitForDeepLink,
} from "../../fixtures/deeplink/record.js";

import rootManifest from "../../../package.json" with { type: "json" };

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

const LSREGISTER =
  "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister";

/*
 * End to end: builds a real NW.js MacOS app with `app.protocols`, registers it
 * with LaunchServices and opens links with `open`, the way a browser would.
 * The app records how each link reached it, so this checks both that MacOS
 * routes the scheme to the app and that NW.js hands the URL to the app.
 */
describe(
  "builder deep links on MacOS",
  { skip: process.platform !== "darwin" },
  async function () {
    const version = rootManifest.devDependencies.nw.split("^")[1];
    const arch = util.ARCH_KV[process.arch];
    const cacheDir = path.join(repoRoot, "tests/fixtures/builder/cache");
    /* Unique, so a registration left over from an earlier run can't answer. */
    const protocol = `nwbuilder-test-${process.pid}`;
    let tmpDir = "";
    let appPath = "";
    let recordFile = "";

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwbuilder-deeplink-"),
      );
      const srcDir = path.join(tmpDir, "src");
      const outDir = path.join(tmpDir, "out");
      recordFile = path.join(tmpDir, "record.jsonl");
      appPath = path.join(outDir, "Demo.app");
      await prepareDeepLinkApp(srcDir, recordFile);

      const nwOptions = {
        version,
        flavor: "normal",
        platform: "osx",
        arch,
        downloadUrl: "https://dl.nwjs.io",
        manifestUrl: "https://nwjs.io/versions.json",
        cacheDir,
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
        shaSum: true,
      };
      await get(nwOptions);
      const releaseInfo = await util.getReleaseInfo(
        version,
        "osx",
        arch,
        cacheDir,
        nwOptions.manifestUrl,
      );

      await build({
        ...nwOptions,
        srcDir,
        outDir,
        glob: false,
        app: /** @type {any} */ ({
          name: "Demo",
          CFBundleIdentifier: `io.nwutils.deeplink.test${process.pid}`,
          CFBundleName: "Demo",
          CFBundleDisplayName: "Demo",
          CFBundleSpokenName: "Demo",
          CFBundleVersion: "1.0.0",
          CFBundleShortVersionString: "1.0.0",
          LSFileQuarantineEnabled: false,
          protocols: [protocol],
        }),
        releaseInfo,
      });

      /* Building edits the bundle, which breaks NW.js' signature: re-sign ad-hoc so MacOS runs it. */
      child_process.execFileSync("codesign", [
        "--force",
        "--deep",
        "--sign",
        "-",
        appPath,
      ]);
      /* Register now, rather than relying on the app having been launched once. */
      child_process.execFileSync(LSREGISTER, ["-f", appPath]);
    });

    after(async function () {
      child_process.spawnSync("pkill", ["-f", appPath]);
      child_process.spawnSync(LSREGISTER, ["-u", appPath]);
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    it(
      "starts the app with the link in nw.App.argv",
      { timeout: 120_000 },
      async function () {
        const url = `${protocol}://cold`;
        child_process.execFileSync("open", [url]);
        const record = await waitForDeepLink(recordFile, url);
        assert.strictEqual(record.event, "argv", JSON.stringify(record));
      },
    );

    it(
      "passes a link to the running app through nw.App.on('open')",
      { timeout: 120_000 },
      async function () {
        const url = `${protocol}://warm`;
        child_process.execFileSync("open", [url]);
        const record = await waitForDeepLink(recordFile, url);
        assert.strictEqual(record.event, "open", JSON.stringify(record));
      },
    );
  },
);
