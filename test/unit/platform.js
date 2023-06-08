import { equal } from "node:assert";
import { describe, it } from "node:test";

import { getPlatform } from "../../src/util/platform.js";

describe("platform tests", () => {
  it("linux platform support", () => {
    equal(getPlatform("linux"), "linux");
  });

  it("macos platform support", () => {
    equal(getPlatform("darwin"), "osx");
  });

  it("windows platform support", () => {
    equal(getPlatform("win32"), "win");
  });
});
