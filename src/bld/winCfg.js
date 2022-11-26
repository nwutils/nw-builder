import { rename } from "node:fs/promises";

import rcedit from "rcedit";

const setWinConfig = async (pkg, outDir) => {

  await rename(`${outDir}/nw.exe`, `${outDir}/${pkg.name}.exe`);

  return rcedit(`${outDir}/${pkg.name}.exe`, {
    "file-version": pkg.version,
    "product-version": pkg.version,
    "icon": pkg.icon,
    "version-string": {
      FileDescription: pkg.description,
      LegalCopyright: pkg.copyright,
      ProductName: pkg.name,
      OriginalFilename: "",
    },
  });
};

export { setWinConfig };
