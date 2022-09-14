import { platformsParser } from "./platformsParser.js";

test("for linux", () => {
  expect(platformsParser(["linux"])).toEqual(["linux32", "linux64"]);
});

test("for osx", () => {
  expect(platformsParser(["osx"])).toEqual(["osx32", "osx64"]);
});

test("for win", () => {
  expect(platformsParser(["win"])).toEqual(["win32", "win64"]);
});
