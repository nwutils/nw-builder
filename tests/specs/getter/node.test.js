import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { headersFileName } from "../../../packages/getter/src/node.js";

describe("getter/node headersFileName", function () {
  it('uses "nw-headers-" before v0.111.3', function () {
    assert.strictEqual(
      headersFileName("0.107.0"),
      "nw-headers-v0.107.0.tar.gz",
    );
    assert.strictEqual(
      headersFileName("0.111.2"),
      "nw-headers-v0.111.2.tar.gz",
    );
  });

  it('uses "node-" from v0.111.3 onward', function () {
    assert.strictEqual(headersFileName("0.111.3"), "node-v0.111.3.tar.gz");
    assert.strictEqual(headersFileName("0.120.0"), "node-v0.120.0.tar.gz");
  });
});
