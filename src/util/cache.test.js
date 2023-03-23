import { isCached } from "./cache.js";

test("directory does not exist", () => {
  expect(isCached("")).resolves.toBe(false);
});

test("directory exists", () => {
  expect(isCached("./e2e/fixture/cacheDir")).resolves.toBe(true);
});
