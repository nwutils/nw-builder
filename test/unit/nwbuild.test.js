import validate from "../../src/validate";

test("for run mode", () => {
  let given = {
    mode: "run",
    appDir: "./",
  };

  let expected = {
    mode: "run",
    appDir: "./",
  };

  expect(validate(given)).resolves.toEqual(expected);
});

test("for build mode", () => {
  let given = {
    mode: "build",
    appDir: "./",
  };

  let expected = {
    mode: "build",
    appDir: "./",
  };

  expect(validate(given)).resolves.toEqual(expected);
});

test("throw error for invalid mode argument", () => {
  let given = {
    mode: "ran",
    appDir: "./",
  };
  expect(validate(given)).rejects.toThrow();
});
