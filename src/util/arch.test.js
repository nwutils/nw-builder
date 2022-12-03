import { getArch } from "./arch.js";

test("invalid/unsupported arch", () => {
    expect(getArch("arm64")).rejects.toThrow();
});

test("x32 arch support", () => {
    expect(getArch("ia32")).resolves.toBe("ia32");
});

test("x64 arch support", () => {
    expect(getArch("x64")).resolves.toBe("x64");
});