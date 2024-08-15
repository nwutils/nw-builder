import { describe, expect, it } from "vitest";

import util from "../util.js";

import request from "./request.js";

describe.skip("get/request", function () {

  let url = "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"
  const filePath = "./test/fixture/cache/request.test.json";

  it("downloads from specific url", async function () {
    await request(url, filePath);
    expect(util.fileExists(filePath)).resolves.toBe(true);
  });
});
