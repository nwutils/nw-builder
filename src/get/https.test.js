import { describe, expect, it } from "vitest";

import request from "./https.js";

describe("get https", function () {

  let url = "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"

  it("downloads from specific url", async function () {
    const buffer = await request(url);
    // Find a better way to assert this
    expect(buffer).not.toBeUndefined();
  }, Infinity);

  it("throws error if url is invalid", async function () {
    url = "";
    await expect(request(url)).rejects.toThrowError();
  });
});
