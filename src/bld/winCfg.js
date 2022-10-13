import rcedit from "rcedit";

const setWinConfig = async (pkg, outDir) => {
  return rcedit(`${outDir}/nw.exe`, {
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
