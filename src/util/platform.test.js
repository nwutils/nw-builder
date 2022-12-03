import { getPlatform } from "./platform.js";

test("invalid/unsupported platform", () => {
    expect(getPlatform("arm")).rejects.toThrow();
});

test("linux platform support", () => {
    expect(getPlatform("linux")).resolves.toBe("linux");
});

test("macos platform support", () => {
    expect(getPlatform("darwin")).resolves.toBe("osx");
});

test("windows platform support", () => {
    expect(getPlatform("win32")).resolves.toBe("win");
});