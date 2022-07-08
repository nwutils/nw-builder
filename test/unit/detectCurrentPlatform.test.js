import detectCurrentPlatform from "../../src/utilities/detectCurrentPlatform";
import Platform from "../../src/constants/Platform";

const processEnv = { ...process.env };

test("for OSX 32 platform", () => {
  const process = {};
  process.platform = "darwin";
  process.arch = "x32";

  expect(detectCurrentPlatform(process)).toBe(Platform.OSX_32);
});

test("for OSX 64 platform", () => {
  const process = {};
  process.platform = "darwin";
  process.arch = "x64";

  expect(detectCurrentPlatform(process)).toBe(Platform.OSX_64);
});

test("for Linux 32 platform", () => {
  const process = {};
  process.platform = "linux";
  process.arch = "x32";

  expect(detectCurrentPlatform(process)).toBe(Platform.NIX_32);
});

test("for Linux 64 platform", () => {
  const process = {};
  process.platform = "linux";
  process.arch = "x64";

  expect(detectCurrentPlatform(process)).toBe(Platform.NIX_64);
});

test("for Windows 32 platform", () => {
  const process = {};
  process.platform = "win32";
  process.arch = "x32";
  process.env = { ...processEnv };
  process.env.PROCESSOR_ARCHITEW6432 = undefined;

  expect(detectCurrentPlatform(process)).toBe(Platform.WIN_32);
});

test("for Windows 64 platform", () => {
  const process = {};
  process.platform = "win32";
  process.arch = "x64";
  process.env = { ...processEnv };
  process.env.PROCESSOR_ARCHITEW6432 = undefined;

  expect(detectCurrentPlatform(process)).toBe(Platform.WIN_64);
});

export {};
