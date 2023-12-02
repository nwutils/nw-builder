import { equal } from "node:assert";
import { describe, it } from "node:test";

import { ARCH_KV } from "../../src/util.js";

describe("arch tests", () => {
  it("x32 arch support", () => {
    equal(ARCH_KV("ia32"), "ia32");
  });

  it("x64 arch support", () => {
    equal(ARCH_KV("x64"), "x64");
  });
});
