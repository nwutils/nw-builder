import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, it } from "node:test";

const scriptPath = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "bin",
  "coverage-report.sh",
);

const SAMPLE_INPUT = `
ℹ start of coverage report
ℹ file      | line % | branch % | funcs % | uncovered lines
ℹ ----------------------------------------------------------
ℹ main.js   |  96.84 |    50.00 |  100.00 | 31 57-58
ℹ ----------------------------------------------------------
ℹ all files |  96.84 |    50.00 |  100.00 |
ℹ ----------------------------------------------------------
ℹ end of coverage report
`;

/**
 * @param {string[]} args - Arguments to pass to coverage-report.sh.
 * @param {string} input - Text piped to the script's stdin.
 * @returns {{stdout: string, status: number | null}} - The script's result.
 */
function run(args, input) {
  const result = spawnSync("bash", [scriptPath, ...args], {
    input,
    encoding: "utf8",
  });
  return { stdout: result.stdout, status: result.status };
}

describe("coverage-report.sh", function () {
  it("requires a name and an os argument", function () {
    const result = run([], SAMPLE_INPUT);
    assert.notStrictEqual(result.status, 0);
  });

  it("renders a markdown table with the given name and os in the header", function () {
    const { stdout } = run(["doctor", "ubuntu-24.04"], SAMPLE_INPUT);
    assert.match(stdout, /### 📊 doctor Coverage Report — ubuntu-24\.04/);
    assert.match(
      stdout,
      /\| File \| Line % \| Branch % \| Funcs % \| Uncovered Lines \|/,
    );
  });

  it("extracts only the rows between the coverage report markers", function () {
    const { stdout } = run(["doctor", "ubuntu-24.04"], SAMPLE_INPUT);
    assert.match(
      stdout,
      /\| main\.js \| 96\.84 \| 50\.00 \| 100\.00 \| 31 57-58 \|/,
    );
    assert.match(stdout, /\| all files \| 96\.84 \| 50\.00 \| 100\.00 \| \|/);
  });

  it("produces an empty table when there is no coverage report in the input", function () {
    const { stdout } = run(["doctor", "ubuntu-24.04"], "no coverage here\n");
    assert.match(stdout, /### 📊 doctor Coverage Report/);
    assert.doesNotMatch(stdout, /main\.js/);
  });
});
