import { validate } from "./validate";

describe("option object", () => {
    test("option type as undefined", () => {
        expect(validate(undefined)).resolves.toBe(false);
    });

    test("option type as null", () => {
        expect(validate(null)).resolves.toBe(false);
    });

    test("option type as boolean", () => {
        expect(validate(true)).resolves.toBe(false);
    });

    test("option type as number", () => {
        expect(validate(42)).resolves.toBe(false);
    });

    test("option type as function", () => {
        expect(validate(function () {})).resolves.toBe(false);
    });

    test("option type as object", () => {
        expect(validate({})).resolves.toBe(false);
    });

})