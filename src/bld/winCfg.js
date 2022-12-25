import { rename } from "node:fs/promises";
import { platform } from "node:process";

import rcedit from "rcedit";

import { log } from "../log.js";

/**
 * Windows specific configuration steps
 * https://learn.microsoft.com/en-us/windows/win32/msi/version
 * https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
 * https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel
 * https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
 *
 * @param {object} app     Multi platform configuration options
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
    await rename(`${outDir}/nw.exe`, `${outDir}/${app.name}.exe`);

    if (platform === "win32") {
      await rcedit(`${outDir}/${app.name}.exe`, {
        "file-version": app.version,
        "icon": app.icon,
        "product-version": app.version,
        "version-string": versionString,
      });
    } else {
      throw new Error(
        `The exe cannot be modified on platform ${platform}. Either install Wine or build on a Windows OS. `,
      );
    }
  } catch (error) {
    log.error(error);
  }
};

export { setWinConfig };
