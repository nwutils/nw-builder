import { getPlatform } from "./platform.js";

test("invalid/unsupported platform", () => {
  expect(getPlatform("aix")).toBeUndefined();
});

test("linux platform support", () => {
  expect(getPlatform("linux")).toBe("linux");
});

test("macos platform support", () => {
  expect(getPlatform("darwin")).toBe("osx");
});

test("windows platform support", () => {
  expect(getPlatform("win32")).toBe("win");
});
