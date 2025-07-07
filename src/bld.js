import child_process from 'node:child_process';
import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import archiver from 'archiver';
import * as resedit from 'resedit';
// pe-library is a direct dependency of resedit
import * as peLibrary from 'pe-library';
import * as tar from 'tar';

import util from './util.js';
import setOsxConfig from './bld/osx.js';

/**
 * References:
 * https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html
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
 * @typedef  {object} OsxRc                           OSX resource configuration options
 * @property {string} name                            The name of the application
 * @property {string} icon                            The path to the icon file. It should be a .icns file.
 * @property {string} LSApplicationCategoryType       The category that best describes your app for the App Store.
 * @property {string} CFBundleIdentifier              A unique identifier for a bundle usually in reverse DNS format.
 * @property {string} CFBundleName                    A user-visible short name for the bundle.
 * @property {string} CFBundleDisplayName             The user-visible name for the bundle.
 * @property {string} CFBundleSpokenName              A replacement for the app name in text-to-speech operations.
 * @property {string} CFBundleVersion                 The version of the build that identifies an iteration of the bundle.
 * @property {string} CFBundleShortVersionString      The release or version number of the bundle.
 * @property {string} NSHumanReadableCopyright        A human-readable copyright notice for the bundle.
 * @property {string} NSLocalNetworkUsageDescription  A human-readable description of why the application needs access to the local network.
 */

/**
 * References:
 * https://learn.microsoft.com/en-us/windows/win32/msi/version
 * https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
 * https://learn.microsoft.com/en-us/visualstudio/deployment/trustinfo-element-clickonce-application?view=vs-2022#requestedexecutionlevel
 * https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
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
 * @property {string} languageCode      Language of the file, defined by Microsoft, see: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oe376/6c085406-a698-4e12-9d4d-c3b0ee3dbc4a
 */

/**
 * @typedef {object} BuildOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]                        Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]                         Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]                                  Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                                      Target arch
 * @property {string}                               [manifestUrl = "https://nwjs.io/versions.json"]  Manifest URL
 * @property {string}                               [srcDir = "./src"]                          Source directory
 * @property {string}                               [cacheDir = "./cache"]                      Cache directory
 * @property {string}                               [outDir = "./out"]                          Out directory
 * @property {LinuxRc | WinRc | OsxRc}              [app]                                       Platform specific rc
 * @property {boolean}                              [glob = true]                               File globbing
 * @property {boolean | string | object}            [managedManifest = false]                   Manage manifest
 * @property {false | "gyp"}                        [nativeAddon = false]                       Rebuild native modules
 * @property {false | "zip" | "tar" | "tgz"}        [zip = false]                               Compress built artifacts
 * @property {object}                               [releaseInfo = {}]                          Version specific release metadata.
 */

/**
 * Build NW.js application.
 * @async
 * @function
 * @param  {BuildOptions}  options  - Build options
 * @returns {Promise<void>}
 */
async function bld({
  version = 'latest',
  flavor = 'normal',
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  srcDir = './src',
  cacheDir = './cache',
  outDir = './out',
  app,
  glob = true,
  managedManifest = false,
  nativeAddon = false,
  zip = false,
  releaseInfo = {},
}) {
  const nwDir = path.resolve(
    cacheDir,
    `nwjs${flavor === 'sdk' ? '-sdk' : ''}-v${version}-${platform
    }-${arch}`,
  );

  await fs.promises.rm(outDir, { force: true, recursive: true });
  await fs.promises.cp(nwDir, outDir, { recursive: true, verbatimSymlinks: true });

  const files = await util.globFiles({ srcDir, glob });
  let manifest = await util.getNodeManifest({ srcDir, glob });

  /* Set `product_string` in manifest for MacOS. This is used in renaming the Helper apps. */
  if (platform === 'osx') {
    manifest.json.product_string = app.name;
    await fs.promises.writeFile(manifest.path, JSON.stringify(manifest.json));
  }

  if (glob) {
    for (let file of files) {
      const stats = await fs.promises.stat(file);
      if (stats.isDirectory()) {
        continue;
      }
      await fs.promises.cp(
        file,
        path.resolve(
          outDir,
          platform !== 'osx'
            ? 'package.nw'
            : 'nwjs.app/Contents/Resources/app.nw',
          file,
        ),
        { recursive: true, force: true },
      );
    }
  } else {
    await fs.promises.cp(
      files,
      path.resolve(
        outDir,
        platform !== 'osx'
          ? 'package.nw'
          : 'nwjs.app/Contents/Resources/app.nw',
      ),
      { recursive: true, verbatimSymlinks: true },
    );
  }

  // const nodeVersion = releaseInfo.components.node;

  if (
    managedManifest === true ||
    typeof managedManifest === 'object' ||
    typeof managedManifest === 'string'
  ) {
    await manageManifest({ nwPkg: manifest.json, managedManifest, outDir, platform });
  }

  if (platform === 'linux') {
    await setLinuxConfig({ app, outDir });
  } else if (platform === 'win') {
    await setWinConfig({ app, outDir });
  } else if (platform === 'osx') {
    await setOsxConfig({ app, outDir, releaseInfo });
  }

  if (nativeAddon === 'gyp') {
    throw new Error('Rebuilding Node addons functionality is broken and has been disabled. This functionality may be removed in the future.');
    // buildNativeAddon({ cacheDir, version, platform, arch, outDir, nodeVersion });
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

  if (typeof managedManifest === 'object') {
    manifest = managedManifest;
  }

  if (typeof managedManifest === 'string') {
    manifest = JSON.parse(await fs.promises.readFile(managedManifest));
  }

  if (manifest.devDependencies) {
    manifest.devDependencies = undefined;
  }
  manifest.packageManager = manifest.packageManager ?? 'npm@*';

  await fs.promises.writeFile(
    path.resolve(
      outDir,
      platform !== 'osx'
        ? 'package.nw'
        : 'nwjs.app/Contents/Resources/app.nw',
      'package.json',
    ),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );

  const cwd = path.resolve(
    outDir,
    platform !== 'osx'
      ? 'package.nw'
      : 'nwjs.app/Contents/Resources/app.nw',
  );

  if (manifest.packageManager.startsWith('npm')) {
    child_process.execSync('npm install', { cwd });
  } else if (manifest.packageManager.startsWith('yarn')) {
    child_process.execSync('yarn install', { cwd });
  } else if (manifest.packageManager.startsWith('pnpm')) {
    child_process.execSync('pnpm install', { cwd });
  }
};

const setLinuxConfig = async ({ app, outDir }) => {
  if (process.platform === 'win32') {
    console.warn(
      'Linux apps built on Windows platform do not preserve all file permissions. See #716',
    );
  }
  let desktopEntryFile = {
    Type: 'Application',
    Version: '1.5',
    Name: app.name,
    GenericName: app.genericName,
    NoDisplay: app.noDisplay,
    Comment: app.comment,
    Icon: app.icon ? path.resolve(outDir, 'package.nw', app.icon) : '',
    Hidden: app.hidden,
    OnlyShowIn: app.onlyShowIn,
    NotShowIn: app.notShowIn,
    DBusActivatable: app.dBusActivatable,
    TryExec: app.tryExec,
    Exec: app.exec,
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

  await fs.promises.rename(`${outDir}/nw`, `${outDir}/${app.name}`);

  let fileContent = '[Desktop Entry]\n';
  Object.keys(desktopEntryFile).forEach((key) => {
    if (desktopEntryFile[key] !== undefined) {
      fileContent += `${key}=${desktopEntryFile[key]}\n`;
    }
  });
  let filePath = `${outDir}/${app.name}.desktop`;
  await fs.promises.writeFile(filePath, fileContent);
};

const setWinConfig = async ({ app, outDir }) => {
  let versionString = {
    Comments: app.comments,
    CompanyName: app.company,
    FileDescription: app.fileDescription,
    FileVersion: app.fileVersion,
    InternalName: app.internalName,
    LegalCopyright: app.legalCopyright,
    LegalTrademarks: app.legalTrademark,
    OriginalFilename: app.originalFilename,
    PrivateBuild: app.privateBuild,
    ProductName: app.productName,
    ProductVersion: app.productVersion,
    SpecialBuild: app.specialBuild,
  };

  Object.keys(versionString).forEach((option) => {
    if (versionString[option] === undefined) {
      delete versionString[option];
    }
  });

  const outDirAppExe = path.resolve(outDir, `${app.name}.exe`);
  await fs.promises.rename(path.resolve(outDir, 'nw.exe'), outDirAppExe);
  const exe = peLibrary.NtExecutable.from(await fs.promises.readFile(outDirAppExe));
  const res = peLibrary.NtExecutableResource.from(exe);
  // English (United States)
  const EN_US = 1033;
  if (app.icon) {
    const iconBuffer = await fs.promises.readFile(path.resolve(app.icon));
    const iconFile = resedit.Data.IconFile.from(iconBuffer);
    const iconGroupIDs = resedit.Resource.IconGroupEntry.fromEntries(res.entries).map((entry) => entry.id);
    resedit.Resource.IconGroupEntry.replaceIconsForResource(
      res.entries,
      /*  Should be `IDR_MAINFRAME` */
      iconGroupIDs[0],
      EN_US,
      iconFile.icons.map(i => i.data)
    );
  }
  const [vi] = resedit.Resource.VersionInfo.fromEntries(res.entries);
  if (app.languageCode !== EN_US) {
    res.removeResourceEntry(16, 1, EN_US);
    vi.removeAllStringValues({
      lang: EN_US,
      codepage: 1200,
    });
    vi.lang=app.languageCode;
  }
  vi.setFileVersion(app.fileVersion, app.languageCode);
  vi.setProductVersion(app.productVersion, app.languageCode);
  vi.setStringValues({
    lang: app.languageCode,
    codepage: 1200
  }, versionString);
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  const outBuffer = Buffer.from(exe.generate());
  await fs.promises.writeFile(outDirAppExe, outBuffer);
};

/*
const buildNativeAddon = ({ cacheDir, version, platform, arch, outDir, nodeVersion }) => {
  let nodePath = path.resolve(cacheDir, `node-v${version}-${platform}-${arch}`);
  const cwd = path.resolve(
    outDir,
    platform !== 'osx'
      ? 'package.nw'
      : 'nwjs.app/Contents/Resources/app.nw',
  );

  child_process.execFileSync('node-gyp', ['rebuild', `--target=${nodeVersion}`, `--nodedir=${nodePath}`], { cwd });
};
*/

const compress = async ({
  zip,
  outDir,
}) => {
  if (zip === true || zip === 'zip') {
    const archive = archiver('zip');
    const writeStream = fs.createWriteStream(`${outDir}.zip`);
    archive.pipe(writeStream);
    archive.directory(outDir, false);
    await archive.finalize();
  } else if (zip === 'tar') {
    await tar.create({
      gzip: false,
      file: `${outDir}.tar`,
    }, [outDir]);
  } else if (zip === 'tgz') {
    await tar.create({
      gzip: true,
      file: `${outDir}.tgz`,
    }, [outDir]);
  }

  await fs.promises.rm(outDir, { recursive: true, force: true });
};

export default bld;
