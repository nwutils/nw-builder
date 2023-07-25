import { rename } from "node:fs/promises";
import { resolve } from "node:path";

import rcedit from "rcedit";

import { log } from "../log.js";

/**
 * @typedef {object} WinRc              Windows configuration options
 * @property {string} name              The name of the application
 * @property {string} version           The version of the application
 * @property {string} comments          Additional information that should be displayed for diagnostic purposes.
 * @property {string} company           Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required.
 * @property {string} fileDescription   File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required.
 * @property {string} fileVersion       Version number of the file. For example, 3.10 or 5.00.RC2. This string is required.
 * @property {string} internalName      Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required.
 * @property {string} legalCopyright    Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional.
 * @property {string} legalTrademark    Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional.
 * @property {string} originalFilename  Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required.
 * @property {string} privateBuild      Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block.
 * @property {string} productName       Name of the product with which the file is distributed. This string is required.
 * @property {string} productVersion    Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required.
 * @property {string} specialBuild      Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block.
 */

/**
 * Windows specific configuration steps
 * https://learn.microsoft.com/en-us/windows/win32/msi/version
 * https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
 * https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel
 * https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
 *
 * @param {WinRc}  app     Resource configuration options for Windows
 * @param {string} outDir  The directory to hold build artifacts
 */
const setWinConfig = async (app, outDir) => {
  let versionString = {
    Comments: app.comments,
    CompanyName: app.author,
    FileDescription: app.fileDescription,
    FileVersion: app.fileVersion,
    InternalName: app.name,
    LegalCopyright: app.legalCopyright,
    LegalTrademarks: app.legalTrademark,
    OriginalFilename: app.name,
    PrivateBuild: app.name,
    ProductName: app.name,
    ProductVersion: app.version,
    SpecialBuild: app.name,
  };

  Object.keys(versionString).forEach((option) => {
    if (versionString[option] === undefined) {
      delete versionString[option];
    }
  });

  try {
    const outDirAppExe = resolve(outDir, `${app.name}.exe`);
    await rename(resolve(outDir, "nw.exe"), outDirAppExe);
    await rcedit(outDirAppExe, {
      "file-version": app.version,
      "product-version": app.version,
      "version-string": versionString,
    });
  } catch (error) {
    log.warn(
      "Renaming EXE failed or unable to modify EXE. If it's the latter, ensure WINE is installed or build your application Windows platform",
    );
    log.error(error);
  }
};

export { setWinConfig };
