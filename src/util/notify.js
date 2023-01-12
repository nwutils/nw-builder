import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import updateNotifier from "update-notifier";


/**
 * Notify the user if there is a new version of the package available.
*
* @return {Promise<void>}
*/
export const notify = async () => {
  const packageJson = require("../../package.json");
  updateNotifier({ pkg: packageJson }).notify();
};
