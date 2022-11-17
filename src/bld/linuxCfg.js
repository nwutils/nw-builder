import { rename, writeFile } from "node:fs/promises";

import { log } from "../log.js";

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html
 *
 * @param  {object}    pkg     srcDir's package.json as JSON
 * @param  {string}    outDir  directory which stores build artifacts
 * @return {undefined}
 */
export const setLinuxConfig = async (pkg, outDir) => {
  await rename(`${outDir}/nw`, `${outDir}/${pkg.name}`);
  if (typeof pkg.linuxCfg === "object") {
    let fileContent = `[Desktop Entry]\n`;
    Object.keys(pkg.linuxCfg).forEach((key) => {
      fileContent += `${key}=${pkg.linuxCfg[key]}\n`;
      log.info(`Add ${key}=${pkg.linuxCfg[key]} to Desktop Entry File`);
    });
    let filePath = `${outDir}/${pkg.name}.desktop`;
    await writeFile(filePath, fileContent);
  } else {
    log.warn("No LinuxCfg object found in srcDir/package.json`");
    log.info("The Desktop Entry file will not be generated");
    log.info("Consult the documentation for what properties to include");
  }
}
