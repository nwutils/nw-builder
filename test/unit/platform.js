import { equal } from "node:assert";
import { describe, it } from "node:test";

import { PLATFORM_KV } from "../../src/util.js";

describe("platform tests", () => {
  it("linux platform support", () => {
    equal(PLATFORM_KV("linux"), "linux");
  });

  it("macos platform support", () => {
    equal(PLATFORM_KV("darwin"), "osx");
  });

  it("windows platform support", () => {
    equal(PLATFORM_KV("win32"), "win");
  });
});
