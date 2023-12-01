import child_process from "node:child_process";
import fsm from "node:fs/promises";

async () => {
  try {
    const watcher = fsm.watch("src", { recursive: true });
    for await (const event of watcher) {
      if (event) {
        child_process.exec("npm run doc:bld");
      }
    }
  } catch (e) {
    console.error(e);
  }
};
