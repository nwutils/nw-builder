import { platform } from "node:process";
import { rename, writeFile } from "node:fs/promises";

import { log } from "../log.js";

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html
 *
 * @param  {object}    app     Multi platform configuration options
 * @param  {string}    outDir  Directory which stores build artifacts
 * @return {undefined}
 */
export const setLinuxConfig = async (app, outDir) => {
  if (platform === "win32") {
    log.warn(
      "Linux apps built on Windows platform do not preserve all file permissions. See #716",
    );
  }
  let desktopEntryFile = {
    Type: "Application",
    Version: "1.5",
    Name: app.name,
    GenericName: app.genericName,
    NoDisplay: app.noDisplay,
    Comment: app.comment,
    Icon: app.icon,
    Hidden: app.hidden,
    OnlyShowIn: app.onlyShowIn,
    NotShowIn: app.notShowIn,
    DBusActivatable: app.dBusActivatable,
    TryExec: app.tryExec,
    Exec: app.name,
    Path: app.path,
    Terminal: app.terminal,
    Actions: app.actions,
    MimeType: app.mimeType,
    Categories: app.categories,
    Implements: app.implements,
    Keywords: app.keywords,
    StartupNotify: app.startupNotify,
    StartupWMClass: app.startupWMClass,
    PrefersNonDefaultGPU: app.prefersNonDefaultGPU,
    SingleMainWindow: app.singleMainWindow,
  };

  await rename(`${outDir}/nw`, `${outDir}/${app.name}`);

  let fileContent = `[Desktop Entry]\n`;
  Object.keys(desktopEntryFile).forEach((key) => {
    if (desktopEntryFile[key] !== undefined) {
      fileContent += `${key}=${desktopEntryFile[key]}\n`;
      log.debug(`Add ${key}=${desktopEntryFile[key]} to Desktop Entry File`);
    }
  });
  let filePath = `${outDir}/${app.name}.desktop`;
  await writeFile(filePath, fileContent);
  log.debug("Desktop Entry file generated");
};
