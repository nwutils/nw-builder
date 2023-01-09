import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

import updateNotifier from "update-notifier";

/**
 * Notify the user if there is a new version of the package available.
 *
 * @return {Promise<void>}
 */
export const notify = async () => {
  const packageJson = JSON.parse(
    await readFile(resolve("..", "..", "package.json")),
  );
  updateNotifier({ pkg: packageJson }).notify();
};
