import { isCached } from "./cache.js";

test("directory does not exist", () => {
    expect(isCached("")).resolves.toBe(false)
});

test("directory exists", () => {
    expect(isCached("./test/fixture/cacheDir")).resolves.toBe(true)
});