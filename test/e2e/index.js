import { resolve } from "node:path";
import { stderr, version } from "node:process";
import { run } from "node:test";

await executeTests();

/**
 * Execute Selenium based tests.
 */
async function executeTests() {
  let tests = [
    resolve("test", "e2e", "addon.js"),
    resolve("test", "e2e", "mode.js"),
  ];

  if (version.startsWith("v16")) {
    run({
      files: tests,
    });
  } else {
    const { tap } = await import("node:test/reporters");

    run({
      files: tests,
    })
      .compose(tap)
      .pipe(stderr);
  }
}
