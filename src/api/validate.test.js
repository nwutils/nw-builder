import { validate } from "./validate";

describe("option object", () => {
  test("option type as undefined", () => {
    expect(validate(undefined)).toBe(false);
  });

  test("option type as null", () => {
    expect(validate(null)).toBe(false);
  });

  test("option type as boolean", () => {
    expect(validate(true)).toBe(false);
  });

  test("option type as number", () => {
    expect(validate(42)).toBe(false);
  });

  test("option type as function", () => {
    expect(validate(function () {})).toBe(false);
  });

  test("option type as object", () => {
    expect(validate({})).toBe(false);
  });
});
