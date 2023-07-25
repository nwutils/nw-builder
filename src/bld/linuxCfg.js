import { platform } from "node:process";
import { rename, writeFile } from "node:fs/promises";

import { log } from "../log.js";

/**
 * @typedef  {object}   LinuxRc               Linux configuration options
 * @typedef  {string}   name                  Name of the application
 * @property {string}   genericName           Generic name of the application
 * @property {boolean}  noDisplay             If true the application is not displayed
 * @property {string}   comment               Tooltip for the entry, for example "View sites on the Internet".
 * @property {string}   icon                  Icon to display in file manager, menus, etc.
 * @property {boolean}  hidden                TBD
 * @property {string[]} onlyShowIn            A list of strings identifying the desktop environments that should (/not) display a given desktop entry
 * @property {string[]} notShowIn             A list of strings identifying the desktop environments that should (/not) display a given desktop entry
 * @property {boolean}  dBusActivatable       A boolean value specifying if D-Bus activation is supported for this application
 * @property {string}   tryExec               Path to an executable file on disk used to determine if the program is actually installed
 * @property {string}   exec                  Program to execute, possibly with arguments.
 * @property {string}   path                  If entry is of type Application, the working directory to run the program in.
 * @property {boolean}  terminal              Whether the program runs in a terminal window.
 * @property {string[]} actions               Identifiers for application actions.
 * @property {string[]} mimeType              The MIME type(s) supported by this application.
 * @property {string[]} categories            Categories in which the entry should be shown in a menu
 * @property {string[]} implements            A list of interfaces that this application implements.
 * @property {string[]} keywords              A list of strings which may be used in addition to other metadata to describe this entry.
 * @property {boolean}  startupNotify         If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all.
 * @property {string}   startupWMClass        If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin
 * @property {boolean}  prefersNonDefaultGPU  If true, the application prefers to be run on a more powerful discrete GPU if available.
 * @property {string}   singleMainWindow      If true, the application has a single main window, and does not support having an additional one opened.
 */

/**
 * Generates a Desktop Entry file for Linux
 * https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s06.html
 *
 * @param  {LinuxRc}       app     Resource configuration options for Linux
 * @param  {string}        outDir  Directory which stores build artifacts
 * @return {Promise<void>}
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
