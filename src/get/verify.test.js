import { describe, expect, it } from "vitest";

import util from "../util.js";

import verify from "./verify.js";

describe("get/verify", function () {

  it("verify shasums", async function () {
    const status = await verify(
      'https://dl.nwjs.io/v0.90.0/SHASUMS256.txt',
      './node_modules/nw/shasum/0.90.0.txt',
      './node_modules/nw'
    );
    expect(status).toBe(true);
  }, Infinity);
});
