import { equal } from "node:assert";
import { describe, it } from "node:test";

import { isCached } from "../../src/util/cache.js";

describe("cache tests", () => {
  it("directory does not exist", async () => {
    equal(await isCached(""), false);
  });

  it("directory exists", async () => {
    equal(await isCached("./test/fixture/cacheDir"), true);
  });
});
