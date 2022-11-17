import fs from "node:fs/promises";

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html
 * @param {Object} pkg srcDir's package.json as JSON
 * @param {string} outDir directory which stores build artifacts
 * @returns {undefined}
 */
export async function setLinuxConfig (pkg, outDir) {
  let fileContent = `[Desktop Entry]\n`;
  if (typeof pkg.linuxCfg === "object") {
    Object.keys(pkg.linuxCfg).forEach((key) => {
      fileContent += `${key}=${pkg.linuxCfg[key]}\n`;
    });
  }
  let filePath = `${outDir}/${pkg.name}.desktop`;
  await fs.writeFile(filePath, fileContent);
};
