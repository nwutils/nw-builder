import { rename } from "node:fs/promises";

import rcedit from "rcedit";

/**
 * Windows specific configuration steps
 * https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
 *
 * @param {object} app     Multi platform configuration options
 * @param {string} outDir  The directory to hold build artifacts
 */
const setWinConfig = async (app, outDir) => {
  await rename(`${outDir}/nw.exe`, `${outDir}/${app.name}.exe`);
  await rcedit(`${outDir}/${app.name}.exe`);
};

export { setWinConfig };
