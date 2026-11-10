import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const appFixtureDir = path.join(import.meta.dirname, "app");

/**
 * Copy the deep link fixture app to `srcDir`, set to record to `recordFile`.
 * @param {string} srcDir
 * @param {string} recordFile
 * @returns {Promise<void>}
 */
export async function prepareDeepLinkApp(srcDir, recordFile) {
  await fs.promises.cp(appFixtureDir, srcDir, { recursive: true });
  const manifestPath = path.join(srcDir, "package.json");
  const manifest = JSON.parse(
    await fs.promises.readFile(manifestPath, "utf-8"),
  );
  manifest.deeplinkRecordFile = recordFile;
  await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Wait until the app has recorded `url`, and return that record.
 * @param {string} recordFile
 * @param {string} url
 * @param {number} [timeoutMs]
 * @returns {Promise<{event: string, value: unknown}>}
 */
export async function waitForDeepLink(recordFile, url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(recordFile)) {
      const records = fs
        .readFileSync(recordFile, "utf-8")
        .split("\n")
        .filter((line) => line !== "")
        .map((line) => JSON.parse(line));
      const match = records.find((record) =>
        JSON.stringify(record.value).includes(url),
      );
      if (match !== undefined) {
        return match;
      }
    }
    await sleep(500);
  }
  const recorded = fs.existsSync(recordFile)
    ? fs.readFileSync(recordFile, "utf-8")
    : "(nothing)";
  throw new Error(
    `The app didn't receive ${url} within ${timeoutMs / 1000}s. Recorded:\n${recorded}`,
  );
}
