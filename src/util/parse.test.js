import { parse } from "./parse.js";

test("no options passed", () => {
  expect(parse({})).rejects.toMatch("error");
});
