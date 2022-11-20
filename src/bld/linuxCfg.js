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
  let desktopEntryFile = {
    Type: "Application",
    Name: pkg.name,
    Exec: pkg.name,
  };
  await rename(`${outDir}/nw`, `${outDir}/${pkg.name}`);
  if (typeof pkg.nwbuild.linuxCfg === "object") {
    Object.keys(pkg.nwbuild.linuxCfg).forEach((key) => {
      if (key !== "Type") {
        desktopEntryFile[key] = pkg.nwbuild.linuxCfg[key];
      }
    });
  }
  let fileContent = `[Desktop Entry]\n`;
  Object.keys(desktopEntryFile).forEach((key) => {
    fileContent += `${key}=${desktopEntryFile[key]}\n`;
    log.debug(`Add ${key}=${desktopEntryFile[key]} to Desktop Entry File`);
  });
  let filePath = `${outDir}/${pkg.name}.desktop`;
  await writeFile(filePath, fileContent);
  log.debug("Desktop Entry file generated");
};
