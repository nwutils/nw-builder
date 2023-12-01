import { exec } from "node:child_process";
import console from "node:console";
import { watch } from "node:fs/promises";

try {
  const watcher = await watch("src", { recursive: true });

  for await (const event of watcher) {
    if (event) {
      exec("node .github/jsdoc.config.cjs");
    }
  }
} catch (e) {
  console.error(e);
}
