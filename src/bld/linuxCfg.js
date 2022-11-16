import fs from "node:fs/promises";

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/
 * @param {Object} pkg srcDir's package.json as JSON
 * @param {string} outDir directory which stores build artifacts
 * @returns {undefined}
 */
export async function setLinuxConfig (pkg, outDir) {
  let fileContent = `[Desktop Entry]
    Name=${pkg.name}
    Version=${pkg.version}
    Exec=bash -c "${pkg.name} package.nw"
    Type=Application
    Terminal=false`;

  let filePath = `${outDir}/${pkg.name}.desktop`;
  await fs.writeFile(filePath, fileContent);
};
