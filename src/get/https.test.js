import fs from "node:fs";

import { describe, expect, it } from "vitest";

import https from "./https.js";

describe("get https", function () {

  let url = "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"
  let out = "./test/fixture/cache/content.json";

  it("gets file from specific url", async function () {
    await https(url, out);
    expect(fs.existsSync(out));
  }, 10);

  it("gets correct file", async function () {
    const actualContents = JSON.parse(await fs.promises.readFile(out));
    const expectedContents = {
      "latest": "v0.75.0",
      "stable": "v0.75.0",
      "lts": "v0.75.0",
      "versions": [
        {
          "version": "v0.75.0",
          "date": "2023/04/15",
          "files": ["osx-arm64"],
          "flavors": ["normal", "sdk"],
          "components": {
            "node": "19.7.0",
            "chromium": "112.0.5615.49"
          }
        },
        {
          "version": "v0.70.0",
          "date": "2022/11/30",
          "files": ["osx-arm64"],
          "flavors": ["normal", "sdk"],
          "components": {
            "node": "19.0.0",
            "chromium": "107.0.5304.88"
          }
        }
      ]
    };
    expect(actualContents).toStrictEqual(expectedContents);
  });

  it("throws error on invalid url", async function () {
    url = "";
    await expect(https(url, out)).rejects.toThrowError();
  });
});
