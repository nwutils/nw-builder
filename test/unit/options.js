import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import NwBuilder from "../../lib/index.cjs";

describe("options", () => {
  it("files is null", async () => {
    const nw = new NwBuilder({ files: null });

    try {
      await nw.init();
    } catch (error) {
      strictEqual(
        error.message,
        "package.json not found in options.files glob patterns.",
      );
    }
  });
});
