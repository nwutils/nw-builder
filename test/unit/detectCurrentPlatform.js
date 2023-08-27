import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import detectCurrentPlatform from "../../src/utilities/detectCurrentPlatform.js";
import Platform from "../../src/constants/Platform.js";

describe("detectCurrentPlatform", () => {
  it("for OSX 32 platform", () => {
    const process = {
      platform: "darwin",
      arch: "x32",
    };

    strictEqual(detectCurrentPlatform(process), Platform.OSX_32);
  });

  it("for OSX 64 platform", () => {
    const process = {
      platform: "darwin",
      arch: "x64",
    };

    strictEqual(detectCurrentPlatform(process), Platform.OSX_64);
  });

  it("for Linux 32 platform", () => {
    const process = {
      platform: "linux",
      arch: "x32",
    };

    strictEqual(detectCurrentPlatform(process), Platform.NIX_32);
  });

  it("for Linux 64 platform", () => {
    const process = {
      platform: "linux",
      arch: "x64",
    };

    strictEqual(detectCurrentPlatform(process), Platform.NIX_64);
  });

  it("for Windows 32 platform", () => {
    const process = {
      platform: "win32",
      arch: "x32",
    };

    strictEqual(detectCurrentPlatform(process), Platform.WIN_32);
  });

  it("for Windows 64 platform", () => {
    const process = {
      platform: "win32",
      arch: "x64",
    };

    strictEqual(detectCurrentPlatform(process), Platform.WIN_64);
  });
});

export {};
