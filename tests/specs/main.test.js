import assert from "node:assert/strict";
import fs from "node:fs";
import { after, before, describe, it } from "node:test";

import doctor from "../../src/main.js";

describe("doctor test suite", function () {
  before(async function () {
    let options = {
      manifestUrl: "https://nwjs.io/versions.json",
      cacheDir: "cache",
      version: "latest",
      srcDir: "tests/fixtures/app",
    };

    await doctor(options);
  });

  it("creates the cache directory", async () => {
    assert.ok(fs.existsSync("./cache"));
  });

  it("downloads the manifest", async () => {
    assert.ok(fs.existsSync("./cache/versions.json"));
  });

  it("updates the package.json file with devEngines", async () => {
    const packageJsonPath = "tests/fixtures/app/package.json";
    assert.ok(fs.existsSync(packageJsonPath));

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    assert.ok(packageJson.devEngines);
    assert.strictEqual(packageJson.devEngines.runtime.name, "node");
    assert.strictEqual(packageJson.devEngines.runtime.onFail, "warn");
    assert.strictEqual(packageJson.devEngines.packageManager.name, "npm");
    assert.strictEqual(packageJson.devEngines.packageManager.onFail, "warn");
  });

  after(function () {
    fs.rmSync("cache", { recursive: true });
  });
});
