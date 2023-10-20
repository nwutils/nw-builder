import { resolve } from "node:path";
import { stdout } from "node:process";
import { run } from "node:test";
import { tap } from "node:test/reporters";

run({
  files: [
    resolve("test", "e2e", "addon.js"),
    resolve("test", "e2e", "mode.js"),
  ],
})
  .compose(tap)
  .pipe(stdout);
