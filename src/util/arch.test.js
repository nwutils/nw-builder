import { getArch } from "./arch.js";

test("x32 arch support", () => {
  expect(getArch("ia32")).toBe("ia32");
});

test("x64 arch support", () => {
  expect(getArch("x64")).toBe("x64");
});
