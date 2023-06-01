import { equal } from "node:assert";
import { describe, it } from "node:test";

import { getArch } from "../../src/util/arch.js";

describe("arch tests", () => {
  it("x32 arch support", () => {
    equal(getArch("ia32"), "ia32");
  });

  it("x64 arch support", () => {
    equal(getArch("x64"), "x64");
  });
});
