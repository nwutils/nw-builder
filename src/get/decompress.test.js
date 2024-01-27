import fs from "node:fs";

import { beforeAll, describe, it } from "vitest";

import decompress from "./decompress.js";
import request from "./request.js";

describe("get decompress", function () {

  let tarUrl = "https://dl.nwjs.io/v0.83.0/nwjs-sdk-v0.83.0-linux-x64.tar.gz";
  let zipUrl = "https://dl.nwjs.io/v0.83.0/nwjs-sdk-v0.83.0-osx-x64.zip";

  beforeAll(async function () {
    await fs.promises.mkdir("./test/fixture/cache");

    const tarBuffer = await request(tarUrl);
    await fs.promises.writeFile("./test/fixture/cache", tarBuffer);
    const zipBuffer = await request(zipUrl);
    await fs.promises.writeFile("./test/fixture/cache", zipBuffer);
  }, Infinity);

  it("decompresses a tar file", async function () {
    await decompress("./test/fixture/cache/nwjs-sdk-v0.83.0-linux-x64.tar.gz", "./test/fixture/cache");
  }, Infinity);

  it("decompresses a zip file", async function () {
    await decompress("./test/fixture/cache/nwjs-sdk-v0.83.0-osx-x64.tar.gz", "./test/fixture/cache");
  }, Infinity);
});
