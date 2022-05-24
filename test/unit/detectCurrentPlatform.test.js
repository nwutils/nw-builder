const { detectCurrentPlatform } = require("../../src/utilities");
const processEnv = { ...process.env };

test("for OSX 32 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "darwin";
  process.arch = "x32";

  expect(detectCurrentPlatform(process)).toBe("osx32");
});

test("for OSX 64 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "darwin";
  process.arch = "x64";

  expect(detectCurrentPlatform(process)).toBe("osx64");
});

test("for Linux 32 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "linux";
  process.arch = "x32";

  expect(detectCurrentPlatform(process)).toBe("linux32");
});

test("for Linux 64 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "linux";
  process.arch = "x64";

  expect(detectCurrentPlatform(process)).toBe("linux64");
});

test("for Windows 32 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "win32";
  process.arch = "x32";
  process.env = { ...processEnv };
  process.env.PROCESSOR_ARCHITEW6432 = undefined;

  expect(detectCurrentPlatform(process)).toBe("win32");
});

test("for Windows 64 platform", () => {
  const process = jest.mock("node:process");
  process.platform = "win32";
  process.arch = "x64";
  process.env = { ...processEnv };
  process.env.PROCESSOR_ARCHITEW6432 = undefined;

  expect(detectCurrentPlatform(process)).toBe("win64");
});