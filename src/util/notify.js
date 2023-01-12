import updateNotifier from "update-notifier";

import packageJson from "../../package.json" assert { type: "json" };

/**
 * Notify the user if there is a new version of the package available.
 *
 * @return {Promise<void>}
 */
export const notify = async () => {
  updateNotifier({ pkg: packageJson }).notify();
};
