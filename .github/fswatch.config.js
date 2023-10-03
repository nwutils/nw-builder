import { exec } from "node:child_process";
import { watch } from "node:fs/promises";

import { log } from "../src/log.js";

try {
  const watcher = await watch("src", { recursive: true });

  for await (const event of watcher) {
    if (event) {
      exec("node .github/jsdoc.config.cjs");
    }
  }
} catch (e) {
  log.error(e);
}
