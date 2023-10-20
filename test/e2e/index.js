import { resolve } from "node:path";
import { stdout, version } from "node:process";
import { run } from "node:test";
import { tap } from "node:test/reporters";

let tests = [
  resolve("test", "e2e", "addon.js"),
  resolve("test", "e2e", "mode.js"),
];

if (version.startsWith("v16")) {
  run({
    files: tests,
  });
} else {
  run({
    files: tests,
  })
    .compose(tap)
    .pipe(stdout);
}
