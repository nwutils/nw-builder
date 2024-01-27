import fs from "node:fs";

import { beforeAll, describe, it } from "vitest";

import decompress from "./decompress.js";
import request from "./request.js";

describe("get decompress", function () {

  let tarUrl = "https://dl.nwjs.io/v0.83.0/nwjs-sdk-v0.83.0-linux-x64.tar.gz";
  let zipUrl = "https://dl.nwjs.io/v0.83.0/nwjs-sdk-v0.83.0-osx-x64.zip";

  beforeAll(async function () {
    await fs.promises.mkdir("./test/fixture/cache");

    await request(tarUrl, "./test/fixture/cache/nw.tar.gz");
    await request(zipUrl, "./test/fixture/cache/nw.zip");
  }, Infinity);

  it("decompresses a Linux tarball", async function () {
    await decompress("./test/fixture/cache/nw.tar.gz", "./test/fixture/cache");
  }, Infinity);

  it("decompresses a MacOS zip", async function () {
    await decompress("./test/fixture/cache/nw.zip", "./test/fixture/cache");
  }, Infinity);
});
