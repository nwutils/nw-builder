import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";

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

/** `kLSApplicationNotFoundErr`: LaunchServices knows no app for the URL. */
const APPLICATION_NOT_FOUND = "-10814";

/**
 * Lines of the LaunchServices database that mention `needle`.
 * @param {string} needle
 * @returns {string[]}
 */
function launchServicesLines(needle) {
  /* The dump is the whole database, often several megabytes. */
  const dump = child_process.spawnSync(LSREGISTER, ["-dump"], {
    encoding: "utf-8",
    maxBuffer: 512 * 1024 * 1024,
  });
  return (dump.stdout ?? "")
    .split("\n")
    .filter((line) => line.includes(needle))
    .map((line) => line.trim());
}

/**
 * Output of a command, for diagnostics; never throws.
 * @param {string} file
 * @param {string[]} args
 * @param {number} [timeout]
 * @returns {string}
 */
function capture(file, args, timeout = 60_000) {
  const result = child_process.spawnSync(file, args, {
    encoding: "utf-8",
    timeout,
    maxBuffer: 64 * 1024 * 1024,
  });
  const status = result.signal ?? result.status ?? result.error?.message;
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  const lines = output.split("\n");
  const kept =
    lines.length > 120
      ? [...lines.slice(0, 80), "...", ...lines.slice(-40)]
      : lines;
  return `$ ${[file, ...args].join(" ")} (exit ${status})\n${kept.join("\n")}`;
}

/**
 * The crashing thread's stack from a MacOS `.ips` crash report: a JSON header
 * line, then the report as JSON.
 * @param {string} text
 * @returns {string}
 */
function crashSummary(text) {
  try {
    const report = JSON.parse(text.slice(text.indexOf("\n") + 1));
    const images = report.usedImages ?? [];
    const thread = report.threads?.[report.faultingThread ?? 0] ?? {};
    const frames = (thread.frames ?? [])
      .slice(0, 40)
      .map(
        (/** @type {any} */ frame) =>
          `  ${path.basename(images[frame.imageIndex]?.path ?? "?")} ${frame.symbol ?? ""}+${frame.symbolLocation ?? frame.imageOffset}`,
      );
    return [
      `${report.procName} (${report.procRole}) ${report.exception?.type} ${report.exception?.signal}`,
      JSON.stringify(report.asi ?? {}),
      ...frames,
    ].join("\n");
  } catch {
    return text.slice(0, 4000);
  }
}

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
    /* LaunchServices indexes ~/Applications like a user's real install location, unlike temporary directories. */
    const appPath = path.join(os.homedir(), "Applications", `${protocol}.app`);
    let tmpDir = "";
    let recordFile = "";

    /**
     * Open `url` with `open`, retrying while LaunchServices doesn't know the
     * scheme yet: registering is asynchronous.
     * @param {string} url
     * @returns {Promise<void>}
     */
    async function openUrl(url) {
      const deadline = Date.now() + 30_000;
      for (;;) {
        const result = child_process.spawnSync("open", [url], {
          encoding: "utf-8",
        });
        if (result.status === 0) {
          return;
        }
        if (
          result.stderr.includes(APPLICATION_NOT_FOUND) === false ||
          Date.now() > deadline
        ) {
          throw new Error(
            [
              `open ${url} failed: ${result.stderr.trim()}`,
              `LaunchServices entries for ${protocol}:`,
              ...launchServicesLines(protocol),
              `LaunchServices entries for ${appPath}:`,
              ...launchServicesLines(appPath),
            ].join("\n"),
          );
        }
        await sleep(1000);
      }
    }

    /**
     * Why the app didn't record a link: whether it runs, its signature, its
     * output when started directly, crash reports, system log lines, and
     * whether the stock NW.js app runs the same page.
     * @returns {Promise<string>}
     */
    async function diagnose() {
      const binary = path.join(appPath, "Contents", "MacOS", "Demo");
      const reports = path.join(os.homedir(), "Library/Logs/DiagnosticReports");
      const crashes = fs.existsSync(reports)
        ? fs
            .readdirSync(reports)
            .filter((name) => /demo|nwjs|helper/i.test(name))
            .map((name) =>
              crashSummary(fs.readFileSync(path.join(reports, name), "utf-8")),
            )
        : [];
      /* Control: the stock NW.js app, not modified by the builder, on the same app. */
      const controlDir = path.join(tmpDir, "control");
      const controlRecord = path.join(tmpDir, "control.jsonl");
      await prepareDeepLinkApp(controlDir, controlRecord);
      const stock = path.join(
        cacheDir,
        `nwjs-v${version}-osx-${arch}`,
        "nwjs.app",
        "Contents",
        "MacOS",
        "nwjs",
      );
      const stockRun = capture(stock, [controlDir], 20_000);
      const controlRecorded = fs.existsSync(controlRecord)
        ? fs.readFileSync(controlRecord, "utf-8")
        : "(nothing)";
      return [
        `Stock NW.js recorded: ${controlRecorded}`,
        stockRun,
        capture("pgrep", ["-fl", appPath]),
        capture("codesign", [
          "--verify",
          "--deep",
          "--strict",
          "--verbose=2",
          appPath,
        ]),
        capture("log", [
          "show",
          "--last",
          "5m",
          "--style",
          "compact",
          "--predicate",
          `process BEGINSWITH "Demo" OR eventMessage CONTAINS "${protocol}"`,
        ]),
        /* Stopped by the timeout if it starts fine. */
        capture(binary, ["--enable-logging=stderr", "--v=1"], 20_000),
        `Crash reports: ${crashes.length}`,
        ...crashes,
      ].join("\n\n");
    }

    /**
     * Wait for the app to record `url`, with diagnostics if it doesn't.
     * @param {string} url
     * @returns {Promise<{event: string, value: unknown}>}
     */
    async function waitForLink(url) {
      try {
        return await waitForDeepLink(recordFile, url);
      } catch (error) {
        throw new Error(
          `${/** @type {Error} */ (error).message}\n\n${await diagnose()}`,
          {
            cause: error,
          },
        );
      }
    }

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwbuilder-deeplink-"),
      );
      const srcDir = path.join(tmpDir, "src");
      const outDir = path.join(tmpDir, "out");
      recordFile = path.join(tmpDir, "record.jsonl");
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

      /* `ditto` keeps the bundle's symbolic links. */
      await fs.promises.mkdir(path.dirname(appPath), { recursive: true });
      child_process.execFileSync("ditto", [
        path.join(outDir, "Demo.app"),
        appPath,
      ]);
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

      /* Registering finishes in the background: wait until the scheme shows up. */
      const deadline = Date.now() + 30_000;
      while (
        launchServicesLines(`${protocol}:`).length === 0 &&
        Date.now() < deadline
      ) {
        await sleep(1000);
      }
    });

    after(async function () {
      child_process.spawnSync("pkill", ["-f", appPath]);
      child_process.spawnSync(LSREGISTER, ["-u", appPath]);
      await fs.promises.rm(appPath, { recursive: true, force: true });
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    it(
      "starts the app with the link in nw.App.argv",
      { timeout: 180_000 },
      async function () {
        const url = `${protocol}://cold`;
        await openUrl(url);
        const record = await waitForLink(url);
        assert.strictEqual(record.event, "argv", JSON.stringify(record));
      },
    );

    it(
      "passes a link to the running app through nw.App.on('open')",
      { timeout: 180_000 },
      async function () {
        const url = `${protocol}://warm`;
        await openUrl(url);
        const record = await waitForLink(url);
        assert.strictEqual(record.event, "open", JSON.stringify(record));
      },
    );
  },
);
