import { strictEqual } from "node:assert";
import { cwd } from "node:process";
import {
  describe,
  it,
} from "node:test";

import checkCache from "../../src/utilities/checkCache.js";

describe("checkCache", () => {
  
  it("for incorrect file path", () => {
    const cacheDir = cwd() + "/test/unit/checkCacheDir/v0.79.1/osx";
    strictEqual(checkCache(cacheDir, ["nw1.app", "nw2.app"]), false)
  });

  it("for correct file path and insufficient number of files", () => {
    const cacheDir = cwd() + "/test/unit/checkCacheDir/v0.79.1/linux64";
    strictEqual(checkCache(cacheDir, ["nw1.app", "nw2.app", "nw3.app"]), false);
  });

  it("for correct file path and valid number of files", () => {
    const cacheDir = cwd() + "/test/unit/checkCacheDir/v0.79.1/linux64";
    strictEqual(checkCache(cacheDir, ["nw1.app", "nw2.app"]), true);
  });

});
