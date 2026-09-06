import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import doctor from "../../../packages/doctor/src/main.js";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
const cacheDir = path.join(repoRoot, "packages/doctor/cache");
const fixtureApp = path.join(repoRoot, "tests/fixtures/doctor/app");

// doctor() writes devEngines into srcDir's package.json - copy the fixture
// into a scratch directory first so the test doesn't mutate the tracked
// fixture in tests/fixtures/doctor/app.
const srcDir = fs.mkdtempSync(path.join(os.tmpdir(), "doctor-test-"));

describe("doctor test suite", function () {
  before(async function () {
    fs.cpSync(fixtureApp, srcDir, { recursive: true });

    let options = {
      manifestUrl: "https://nwjs.io/versions.json",
      cacheDir,
      version: "latest",
      srcDir,
    };

    await doctor(options);
  });

  it("creates the cache directory", async () => {
    assert.ok(fs.existsSync(cacheDir));
  });

  it("downloads the manifest", async () => {
    assert.ok(fs.existsSync(path.join(cacheDir, "manifest.json")));
  });

  it("updates the package.json file with devEngines", async () => {
    const packageJsonPath = path.join(srcDir, "package.json");
    assert.ok(fs.existsSync(packageJsonPath));

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    assert.ok(packageJson.devEngines);
    assert.strictEqual(packageJson.devEngines.runtime.name, "node");
    assert.strictEqual(packageJson.devEngines.runtime.onFail, "warn");
    assert.strictEqual(packageJson.devEngines.packageManager.name, "npm");
    assert.strictEqual(packageJson.devEngines.packageManager.onFail, "warn");
  });

  after(function () {
    fs.rmSync(cacheDir, { recursive: true });
    fs.rmSync(srcDir, { recursive: true });
  });
});
