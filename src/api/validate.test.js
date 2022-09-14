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

describe("files option", () => {
  test("files option as undefined", () => {
    expect(validate({})).toBe(false);
  });

  test("files option as null", () => {
    expect(
      validate({
        files: null,
      }),
    ).toBe(false);
  });
  test("files option as boolean", () => {
    expect(
      validate({
        files: true,
      }),
    ).toBe(false);
  });
  test("files option as number", () => {
    expect(
      validate({
        files: 5,
      }),
    ).toBe(false);
  });

  test("files option as function", () => {
    expect(
      validate({
        files: function () {},
      }),
    ).toBe(false);
  });

  test("files option as object", () => {
    expect(
      validate({
        files: {},
      }),
    ).toBe(false);
  });
});
