import fs from "node:fs/promises";

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html
 *
 * @param  {object}    pkg     srcDir's package.json as JSON
 * @param  {string}    outDir  directory which stores build artifacts
 * @return {undefined}
 */
export async function setLinuxConfig(pkg, outDir) {
  if (typeof pkg.linuxCfg === "object") {
    let fileContent = `[Desktop Entry]\n`;
    Object.keys(pkg.linuxCfg).forEach((key) => {
      fileContent += `${key}=${pkg.linuxCfg[key]}\n`;
    });
    let filePath = `${outDir}/${pkg.name}.desktop`;
    await fs.writeFile(filePath, fileContent);
  } else {
    console.log(`[ WARN ] No LinuxCfg object found in srcDir/package.json`);
    console.log("[ INFO ] The Desktop Entry file will not be generated");
    console.log("[ INFO ] Consult the documentation for what properties to include");
  }
}
