import { describe, expect, it } from "vitest";

import util from "../util.js";

import nw from "./nw.js";

describe("get/nw", function () {

  it("downloades a NW.js Linux tarball", async function () {
    const nwFile = await nw(
      "https://nwjs.io/versions",
      "0.83.0",
      "sdk",
      "linux",
      "x64",
      "./test/fixture"
    );
    expect(util.fileExists(nwFile)).resolves.toBe(true);
  }, Infinity);
});
