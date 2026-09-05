import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import doctor from "../../../packages/doctor/src/main.js";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");
const cacheDir = path.join(repoRoot, "packages/doctor/cache");
const srcDir = path.join(repoRoot, "tests/fixtures/doctor/app");

describe("doctor test suite", function () {
  before(async function () {
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
  });
});
