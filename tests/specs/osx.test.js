import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { beforeAll, describe, expect, it } from "vitest";

import setOsxConfig from "../../src/bld/osx.js";

describe("bld/setOsxConfig", async function () {

  beforeAll("", async function () {
    // copy nwjs exe to outDir
    // call setOsxConfig function
  });

  it("", async function () {
    // verify if apps are renamed properly
  });

  it("", async function () {
    // verify if bundle's plist values are renamed properly
  });
});
