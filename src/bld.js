import child_process from "node:child_process";
import console from "node:console";
import path from "node:path";
import fsm from "node:fs/promises";
import process from "node:process";

import compressing from "compressing";
import * as resedit from "resedit";
// pe-library is a direct dependency of resedit
import * as peLibrary from 'pe-library';
import plist from "plist";

import util from "./util.js"

/**
 * References:
 * https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html
 *
 * @typedef  {object}   LinuxRc               Linux configuration options
 * @property {string}   name                  Name of the application
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
 * References:
 * https://developer.apple.com/documentation/bundleresources/information_property_list
 *
 * @typedef  {object} OsxRc                       OSX resource configuration options
 * @property {string} name                        The name of the application
 * @property {string} icon                        The path to the icon file. It should be a .icns file.
 * @property {string} LSApplicationCategoryType   The category that best describes your app for the App Store.
 * @property {string} CFBundleIdentifier          A unique identifier for a bundle usually in reverse DNS format.
 * @property {string} CFBundleName                A user-visible short name for the bundle.
 * @property {string} CFBundleDisplayName         The user-visible name for the bundle.
 * @property {string} CFBundleSpokenName          A replacement for the app name in text-to-speech operations.
 * @property {string} CFBundleVersion             The version of the build that identifies an iteration of the bundle.
 * @property {string} CFBundleShortVersionString  The release or version number of the bundle.
 * @property {string} NSHumanReadableCopyright    A human-readable copyright notice for the bundle.
 */

/**
 * References:
 * https://learn.microsoft.com/en-us/windows/win32/msi/version
 * https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
 * https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel
 * https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
 *
 * @typedef {object} WinRc              Windows configuration options. More info
 * @property {string} name              The name of the application
 * @property {string} version           The version of the application
 * @property {string} comments          Additional information that should be displayed for diagnostic purposes.
 * @property {string} company           Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required.
 * @property {string} fileDescription   File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required.
 * @property {string} fileVersion       Version number of the file. For example, 3.10 or 5.00.RC2. This string is required.
 * @property {string} icon              The path to the icon file. It should be a .ico file.
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
 * @typedef {object} BuildOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]                        Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]                         Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]                                  Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                                      Target arch
 * @property {string}                               [manifestUrl = "https://nwjs.io/versions"]  Manifest URL
 * @property {string}                               [srcDir = "./src"]                          Source directory
 * @property {string}                               [cacheDir = "./cache"]                      Cache directory
 * @property {string}                               [outDir = "./out"]                          Out directory
 * @property {LinuxRc | WinRc | OsxRc}              [app]                                       Platform specific rc
 * @property {boolean}                              [glob = true]                               File globbing
 * @property {boolean | string | object}            [managedManifest = false]                   Manage manifest
 * @property {false | "gyp"}                        [nativeAddon = false]                       Rebuild native modules
 * @property {false | "zip" | "tar" | "tgz"}        [zip = false]                               Compress built artifacts
 */

/**
 * Build NW.js application.
 *
 * @async
 * @function
 * @param  {BuildOptions}  options  - Build options
 * @return {Promise<void>}
 */
async function bld({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  manifestUrl = "https://nwjs.io/versions",
  srcDir = "./src",
  cacheDir = "./cache",
  outDir = "./out",
  app,
  glob = true,
  managedManifest = false,
  nativeAddon = false,
  zip = false,
}) {
  const nwDir = path.resolve(
    cacheDir,
    `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform
    }-${arch}`,
  );

  await fsm.rm(outDir, { force: true, recursive: true });
  await fsm.cp(nwDir, outDir, { recursive: true, verbatimSymlinks: true });

  const files = await util.globFiles({ srcDir, glob });
  const manifest = await util.getNodeManifest({ srcDir, glob });

  if (glob) {
    for (let file of files) {
      await fsm.cp(
        file,
        path.resolve(
          outDir,
          platform !== "osx"
            ? "package.nw"
            : "nwjs.app/Contents/Resources/app.nw",
          file,
        ),
        { recursive: true, verbatimSymlinks: true },
      );
    }
  } else {
    await fsm.cp(
      files,
      path.resolve(
        outDir,
        platform !== "osx"
          ? "package.nw"
          : "nwjs.app/Contents/Resources/app.nw",
      ),
      { recursive: true, verbatimSymlinks: true },
    );
  }

  const releaseInfo = await util.getReleaseInfo(
    version,
    platform,
    arch,
    cacheDir,
    manifestUrl,
  );
  const nodeVersion = releaseInfo.components.node;

  if (
    managedManifest === true ||
    typeof managedManifest === "object" ||
    typeof managedManifest === "string"
  ) {
    await manageManifest({ manifest, managedManifest, outDir, platform });
  }

  if (platform === "linux") {
    await setLinuxConfig({ app, outDir });
  } else if (platform === "win") {
    await setWinConfig({ app, outDir });
  } else if (platform === "osx") {
    await setOsxConfig({ platform, outDir, app });
  }

  if (nativeAddon === "gyp") {
    buildNativeAddon({ cacheDir, version, platform, arch, outDir, nodeVersion });
  }

  if (zip !== false) {
    await compress({ zip, outDir });
  }
}

const manageManifest = async ({ nwPkg, managedManifest, outDir, platform }) => {
  let manifest = undefined;

  if (managedManifest === true) {
    manifest = nwPkg;
  }

  if (typeof managedManifest === "object") {
    manifest = managedManifest;
  }

  if (typeof managedManifest === "string") {
    manifest = JSON.parse(await fsm.readFile(managedManifest));
  }

  if (manifest.devDependencies) {
    manifest.devDependencies = undefined;
  }
  manifest.packageManager = manifest.packageManager ?? "npm@*";

  await fsm.writeFile(
    path.resolve(
      outDir,
      platform !== "osx"
        ? "package.nw"
        : "nwjs.app/Contents/Resources/app.nw",
      "package.json",
    ),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  process.chdir(
    path.resolve(
      outDir,
      platform !== "osx"
        ? "package.nw"
        : "nwjs.app/Contents/Resources/app.nw",
    ),
  );

  if (manifest.packageManager.startsWith("npm")) {
    child_process.execSync(`npm install`);
  } else if (manifest.packageManager.startsWith("yarn")) {
    child_process.execSync(`yarn install`);
  } else if (manifest.packageManager.startsWith("pnpm")) {
    child_process.execSync(`pnpm install`);
  }
};

const setLinuxConfig = async ({ app, outDir }) => {
  if (process.platform === "win32") {
    console.warn(
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

  await fsm.rename(`${outDir}/nw`, `${outDir}/${app.name}`);

  let fileContent = `[Desktop Entry]\n`;
  Object.keys(desktopEntryFile).forEach((key) => {
    if (desktopEntryFile[key] !== undefined) {
      fileContent += `${key}=${desktopEntryFile[key]}\n`;
    }
  });
  let filePath = `${outDir}/${app.name}.desktop`;
  await fsm.writeFile(filePath, fileContent);
};

const setWinConfig = async ({ app, outDir }) => {
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

  const outDirAppExe = path.resolve(outDir, `${app.name}.exe`);
  await fsm.rename(path.resolve(outDir, "nw.exe"), outDirAppExe);
  const exe = peLibrary.NtExecutable.from(await fsm.readFile(outDirAppExe));
  const res = peLibrary.NtExecutableResource.from(exe);
  // English (United States)
  const EN_US = 1033;
  if (app.icon) {
    const iconBuffer = await fsm.readFile(path.resolve(app.icon));
    const iconFile = resedit.Data.IconFile.from(iconBuffer);
    resedit.Resource.IconGroupEntry.replaceIconsForResource(
      res.entries,
      // This is the name of the icon group nw.js uses that gets shown in file exlorers
      'IDR_MAINFRAME',
      EN_US,
      iconFile.icons.map(i => i.data)
    );
  }
  const [vi] = resedit.Resource.VersionInfo.fromEntries(res.entries);
  const [major, minor, patch] = app.version.split(".");
  vi.setFileVersion(major, minor, patch, 0, EN_US);
  vi.setStringValues({
    lang: EN_US,
    codepage: 1200
  }, versionString);
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  const outBuffer = Buffer.from(exe.generate());
  await fsm.writeFile(outDirAppExe, outBuffer);
};

const setOsxConfig = async ({ outDir, app }) => {
  if (process.platform === "win32") {
    console.warn(
      "MacOS apps built on Windows platform do not preserve all file permissions. See #716",
    );
  }

  try {
    const outApp = path.resolve(outDir, `${app.name}.app`);
    await fsm.rename(path.resolve(outDir, "nwjs.app"), outApp);
    if (app.icon !== undefined) {
      await fsm.copyFile(
        path.resolve(app.icon),
        path.resolve(outApp, "Contents", "Resources", "app.icns"),
      );
    }

    const infoPlistPath = path.resolve(outApp, "Contents", "Info.plist");
    const infoPlistJson = plist.parse(await fsm.readFile(infoPlistPath, "utf-8"));

    const infoPlistStringsPath = path.resolve(
      outApp,
      "Contents",
      "Resources",
      "en.lproj",
      "InfoPlist.strings",
    );
    const infoPlistStringsData = await fsm.readFile(
      infoPlistStringsPath,
      "utf-8",
    );

    let infoPlistStringsDataArray = infoPlistStringsData.split("\n");

    infoPlistStringsDataArray.forEach((line, idx, arr) => {
      if (line.includes("NSHumanReadableCopyright")) {
        arr[idx] =
          `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`;
      }
    });

    infoPlistJson.LSApplicationCategoryType = app.LSApplicationCategoryType;
    infoPlistJson.CFBundleIdentifier = app.CFBundleIdentifier;
    infoPlistJson.CFBundleName = app.CFBundleName;
    infoPlistJson.CFBundleDisplayName = app.CFBundleDisplayName;
    infoPlistJson.CFBundleSpokenName = app.CFBundleSpokenName;
    infoPlistJson.CFBundleVersion = app.CFBundleVersion;
    infoPlistJson.CFBundleShortVersionString = app.CFBundleShortVersionString;

    Object.keys(infoPlistJson).forEach((option) => {
      if (infoPlistJson[option] === undefined) {
        delete infoPlistJson[option];
      }
    });

    await fsm.writeFile(infoPlistPath, plist.build(infoPlistJson));
    await fsm.writeFile(
      infoPlistStringsPath,
      infoPlistStringsDataArray.toString().replace(/,/g, "\n"),
    );
  } catch (error) {
    console.error(error);
  }
};

const buildNativeAddon = ({ cacheDir, version, platform, arch, outDir, nodeVersion }) => {
  let nodePath = path.resolve(cacheDir, `node-v${version}-${platform}-${arch}`);
  process.chdir(
    path.resolve(
      outDir,
      platform !== "osx"
        ? "package.nw"
        : "nwjs.app/Contents/Resources/app.nw",
    ),
  );

  child_process.execSync(`node-gyp rebuild --target=${nodeVersion} --nodedir=${nodePath}`);
};

const compress = async ({
  zip,
  outDir,
}) => {
  if (zip === true || zip === "zip") {
    await compressing.zip.compressDir(outDir, `${outDir}.zip`);
  } else if (zip === "tar") {
    await compressing.tar.compressDir(outDir, `${outDir}.tar`);
  } else if (zip === "tgz") {
    await compressing.tgz.compressDir(outDir, `${outDir}.tgz`);
  }

  await fsm.rm(outDir, { recursive: true, force: true });
};

export default bld;
