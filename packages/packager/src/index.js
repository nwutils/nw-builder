import appImage from "./appImage.js";

/**
 * Supported packaged output formats.
 *
 * `AppImage`, `deb` and `rpm` package a Linux build. `MSIX` and `NSIS`
 * package a Windows build. Only `"AppImage"` is implemented today - the
 * others are reserved so this option doesn't need to change shape once they
 * land.
 * @typedef {"AppImage" | "deb" | "rpm" | "msix" | "nsis" | "dmg"} PackageFormat
 */

/**
 * Package a built NW.js application.
 * @async
 * @function
 * @param  {{format: PackageFormat} & Record<string, any>}  options  `format`, plus the options the matching packager (eg. `appImage`) expects.
 * @returns {Promise<string>}  Path to the resulting packaged artifact.
 */
async function packager({ format, ...options }) {
  switch (format) {
    case "AppImage":
      return appImage(/** @type {any} */ (options));
    case "deb":
    case "rpm":
    case "msix":
    case "nsis":
    case "dmg":
      throw new Error(
        `options.format ${JSON.stringify(format)} is not implemented yet. Currently only "AppImage" is supported.`,
      );
    default:
      throw new Error(
        `Expected options.format to be one of "AppImage", "deb", "rpm", "msix", "nsis" or "dmg". Got ${JSON.stringify(format)}.`,
      );
  }
}

export default packager;