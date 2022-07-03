import checkCache from "../../src/utilities/checkCache";

test("for incorrect file path", () => {
  const cacheDir = process.cwd() + "/test/unit/checkCacheDir/v0.64.1/osx";

  expect(checkCache(cacheDir, ["nw1.app", "nw2.app"])).toBe(false);
});

test("for correct file path and insufficient number of files", () => {
  const cacheDir = process.cwd() + "/test/unit/checkCacheDir/v0.64.1/linux64";

  expect(checkCache(cacheDir, ["nw1.app", "nw2.app", "nw3.app"])).toBe(false);
});

test("for correct file path and valid number of files", () => {
  const cacheDir = process.cwd() + "/test/unit/checkCacheDir/v0.64.1/linux64";
  expect(checkCache(cacheDir, ["nw1.app", "nw2.app"])).toBe(true);
});
