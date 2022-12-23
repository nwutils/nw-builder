import { rename } from "node:fs/promises";

// import rcedit from "rcedit";

/**
 * Windows specific configuration steps
 *
 * @param {object} pkg     The srcDir/package.json as a JSON
 * @param {string} outDir  The directory to hold build artifacts
 */
const setWinConfig = async (pkg, outDir) => {
  await rename(`${outDir}/nw.exe`, `${outDir}/${pkg.name}.exe`);

  // https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource?redirectedfrom=MSDN#string-name
  // await rcedit(`${outDir}/${pkg.name}.exe`, {
  //   "file-version": pkg.version,
  //   "product-version": pkg.version,
  //   "icon": pkg.icon,
  //   "version-string": {
  //     FileDescription: pkg.description,
  //     LegalCopyright: pkg.copyright,
  //     ProductName: pkg.name,
  //     OriginalFilename: pkg.name,
  //   },
  // });
};

export { setWinConfig };
