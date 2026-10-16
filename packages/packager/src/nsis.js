import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import util from "./util.js";

/**
 * @typedef  {object}                       NsisOptions
 * @property {string}                       appDir             Path to a built NW.js Windows application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "win"`.
 * @property {string}                       appName            Name of the application. Must match the `app.name` value used to build `appDir` - the executable is expected at `<appDir>/<appName>.exe`. Must be a valid Windows file name.
 * @property {string}                       version            Version of the application, eg. `"1.2.0"`. Shown in Windows' installed apps list, and converted to `X.X.X.X` for the installer's own version resource.
 * @property {"ia32" | "x64" | "arm64"}     [arch]             Architecture `appDir` was built for. Defaults to the host architecture. The installer refuses to run on Windows machines that can't run that architecture.
 * @property {string}                       [outDir]           Directory the resulting `<appName>-<arch>-Setup.exe` file is written to. Defaults to the parent directory of `appDir`.
 * @property {string}                       [icon]             Path to a `.ico` icon for the installer and uninstaller. Defaults to NSIS' own icon.
 * @property {string}                       [appId]            Name of the registry key the installation is recorded under. Defaults to `appName`. Keep it the same across releases, so installing a new version replaces the previous one.
 * @property {string}                       [publisher]        Publisher shown in Windows' installed apps list.
 * @property {string}                       [copyright]        Copyright notice written into the installer's version information.
 * @property {string}                       [license]          Path to a `.txt` or `.rtf` license file. When set, the installer shows it on a page the user has to accept.
 * @property {boolean}                      [desktopShortcut=true]   If true, create a desktop shortcut.
 * @property {boolean}                      [startMenuShortcut=true] If true, create a Start Menu shortcut.
 * @property {string}                       [makensisPath="makensis"] Path to the NSIS compiler. Defaults to `makensis` on the `PATH`.
 */

/**
 * The files and directories of a built application, relative to its root.
 * @typedef  {object}   AppFiles
 * @property {string[]} files  Relative file paths, using the host's path separator.
 * @property {string[]} dirs   Relative directory paths, parents before children.
 * @property {number}   size   Total size of `files` in bytes.
 */

/**
 * Map nw-builder's architecture identifiers to the `x64.nsh` and `WinVer.nsh`
 * checks for whether the Windows machine running the installer can run that
 * architecture. Each inner list is one way to pass, and all of its checks
 * must pass. x64 builds run natively on x64 and, emulated, on ARM64 - but
 * only from Windows 11, as ARM64 Windows 10 only emulates ia32. Every Windows
 * machine runs ia32 builds.
 * @type {Record<"ia32" | "x64" | "arm64", string[][]>}
 */
const ARCH_CHECK_KV = {
  ia32: [],
  x64: [["${IsNativeAMD64}"], ["${IsNativeARM64}", "${AtLeastWin11}"]],
  arm64: [["${IsNativeARM64}"]],
};

/**
 * Package a built NW.js Windows application as an NSIS installer.
 *
 * The installer installs for the current user only, into
 * `%LOCALAPPDATA%\Programs\<appName>`, so it never asks for administrator
 * rights. It registers an uninstaller in Windows' installed apps list, and
 * installing a new version first uninstalls the previous one. Both wait for
 * the application to be closed before touching its files.
 *
 * This composes with `@nwutils/builder`: run it against the `outDir` (and
 * `app.name`) that `@nwutils/builder` produced for `platform: "win"`.
 * `makensis` runs on Linux and macOS too, so the installer can be built on
 * any host.
 * @async
 * @function
 * @param  {NsisOptions}  options
 * @returns {Promise<string>}  Path to the resulting installer `.exe` file.
 */
async function nsis({
  appDir,
  appName,
  version,
  arch,
  outDir,
  icon,
  appId,
  publisher,
  copyright = "",
  license,
  desktopShortcut = true,
  startMenuShortcut = true,
  makensisPath = "makensis",
}) {
  if (typeof appDir !== "string" || appDir === "") {
    throw new Error(
      `Expected "options.appDir" to be a non-empty string. Received: ${JSON.stringify(appDir)}`,
    );
  }

  if ((await util.fileExists(appDir)) === false) {
    throw new Error(`"options.appDir" does not exist: ${appDir}`);
  }

  /*
   * `appName` names files inside `appDir`, `outDir` and the install
   * directory, and is written into the installer script.
   */
  if (
    typeof appName !== "string" ||
    util.isWindowsFileName(appName) === false
  ) {
    throw new Error(
      `Expected "options.appName" to be a valid Windows file name. Received: ${JSON.stringify(appName)}`,
    );
  }

  if (typeof version !== "string" || version === "") {
    throw new Error(
      `Expected "options.version" to be a non-empty string. Received: ${JSON.stringify(version)}`,
    );
  }
  const fileVersion = util.windowsVersion(version);

  const resolvedArch =
    /** @type {"ia32" | "x64" | "arm64" | undefined} */ (arch) ??
    /** @type {"ia32" | "x64" | "arm64"} */ (
      /** @type {unknown} */ (process.arch)
    );
  /* `Object.hasOwn` so inherited keys such as "constructor" aren't mistaken for architectures. */
  if (Object.hasOwn(ARCH_CHECK_KV, resolvedArch) === false) {
    throw new Error(
      `Expected "options.arch" to be "ia32", "x64" or "arm64". Received: ${JSON.stringify(arch)}`,
    );
  }

  const resolvedAppId = appId ?? appName;
  /* The installation is recorded under a registry key named after `appId`, and `\` separates registry keys. */
  if (
    typeof resolvedAppId !== "string" ||
    resolvedAppId === "" ||
    resolvedAppId.includes("\\") ||
    [...resolvedAppId].some((character) => {
      const code = character.charCodeAt(0);
      return code < 0x20 || code === 0x7f;
    })
  ) {
    throw new Error(
      `Expected "options.appId" to be a non-empty string without "\\" or control characters. Received: ${JSON.stringify(appId)}`,
    );
  }

  if (
    publisher !== undefined &&
    (typeof publisher !== "string" || publisher === "")
  ) {
    throw new Error(
      `Expected "options.publisher" to be a non-empty string. Received: ${JSON.stringify(publisher)}`,
    );
  }

  if (typeof copyright !== "string") {
    throw new Error(
      `Expected "options.copyright" to be a string. Received: ${JSON.stringify(copyright)}`,
    );
  }

  for (const [key, value] of Object.entries({
    desktopShortcut,
    startMenuShortcut,
  })) {
    if (typeof value !== "boolean") {
      throw new Error(
        `Expected "options.${key}" to be a boolean. Received: ${JSON.stringify(value)}`,
      );
    }
  }

  if (typeof makensisPath !== "string" || makensisPath === "") {
    throw new Error(
      `Expected "options.makensisPath" to be a non-empty string. Received: ${JSON.stringify(makensisPath)}`,
    );
  }

  const resolvedIconPath =
    icon === undefined
      ? undefined
      : await resolveInputFile("icon", icon, [".ico"]);
  const resolvedLicensePath =
    license === undefined
      ? undefined
      : await resolveInputFile("license", license, [".txt", ".rtf"]);

  const resolvedAppDir = path.resolve(appDir);
  const executablePath = path.resolve(resolvedAppDir, `${appName}.exe`);
  if ((await util.fileExists(executablePath)) === false) {
    throw new Error(
      `Expected the NW.js executable to exist at ${executablePath}. Does "options.appName" match the "app.name" used to build "options.appDir" for "platform: \\"win\\""?`,
    );
  }

  const resolvedOutDir = path.resolve(outDir ?? path.dirname(resolvedAppDir));
  await fs.promises.mkdir(resolvedOutDir, { recursive: true });
  const installerPath = path.resolve(
    resolvedOutDir,
    `${appName}-${resolvedArch}-Setup.exe`,
  );

  const script = nsisScript({
    appDir: resolvedAppDir,
    appFiles: await listAppFiles(resolvedAppDir),
    appName,
    appId: resolvedAppId,
    version,
    fileVersion,
    arch: resolvedArch,
    installerPath,
    iconPath: resolvedIconPath,
    licensePath: resolvedLicensePath,
    publisher,
    copyright,
    desktopShortcut,
    startMenuShortcut,
  });

  const scriptDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "nwutils-packager-nsis-"),
  );

  try {
    const scriptPath = path.resolve(scriptDir, "installer.nsi");
    await fs.promises.writeFile(scriptPath, script, "utf-8");

    try {
      child_process.execFileSync(
        makensisPath,
        ["-INPUTCHARSET", "UTF8", "-V2", scriptPath],
        { stdio: "inherit" },
      );
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") {
        throw new Error(
          `Could not find the NSIS compiler at ${JSON.stringify(makensisPath)}. Install NSIS (eg. "apt install nsis", "brew install makensis" or "choco install nsis"), or pass its path as "options.makensisPath".`,
          { cause: error },
        );
      }
      throw error;
    }

    return installerPath;
  } finally {
    await fs.promises.rm(scriptDir, { recursive: true, force: true });
  }
}

/**
 * Resolve an input file option, and throw unless it exists and has one of
 * `extensions`.
 * @async
 * @function
 * @param  {string}   key         Option name, for error messages.
 * @param  {unknown}  value       Option value.
 * @param  {string[]} extensions  Accepted lowercase extensions, eg. `[".ico"]`.
 * @returns {Promise<string>}  Absolute path to the file.
 */
async function resolveInputFile(key, value, extensions) {
  if (typeof value !== "string" || value === "") {
    throw new Error(
      `Expected "options.${key}" to be a non-empty string. Received: ${JSON.stringify(value)}`,
    );
  }
  const resolvedPath = path.resolve(value);
  if (extensions.includes(path.extname(resolvedPath).toLowerCase()) === false) {
    throw new Error(
      `Expected "options.${key}" to be a ${extensions.join(" or ")} file. Received: ${resolvedPath}`,
    );
  }
  if ((await util.fileExists(resolvedPath)) === false) {
    throw new Error(`"options.${key}" does not exist: ${resolvedPath}`);
  }
  return resolvedPath;
}

/**
 * List the files and directories under `appDir`. Symbolic links are followed,
 * since NSIS copies what they point at.
 * @async
 * @function
 * @param  {string}  appDir  Absolute path to the built application.
 * @returns {Promise<AppFiles>}
 */
async function listAppFiles(appDir) {
  /** @type {AppFiles} */
  const appFiles = { files: [], dirs: [], size: 0 };

  /**
   * @param {string} relativeDir
   * @returns {Promise<void>}
   */
  async function walk(relativeDir) {
    const entries = await fs.promises.readdir(path.join(appDir, relativeDir));
    for (const entry of entries.sort()) {
      const relativePath = path.join(relativeDir, entry);
      const stats = await fs.promises.stat(path.join(appDir, relativePath));
      if (stats.isDirectory()) {
        appFiles.dirs.push(relativePath);
        await walk(relativePath);
      } else {
        appFiles.files.push(relativePath);
        appFiles.size += stats.size;
      }
    }
  }

  await walk("");
  return appFiles;
}

/**
 * Generate the NSIS script for an installer.
 *
 * Every file is listed explicitly rather than copied with `File /r`, so the
 * uninstaller deletes exactly the files that were installed. The user can
 * choose any install directory - including one such as `C:\` that holds
 * other files - so the uninstaller never deletes directories recursively.
 * @param  {object}                    options
 * @param  {string}                    options.appDir             Absolute path to the built application.
 * @param  {AppFiles}                  options.appFiles           Files and directories under `appDir`.
 * @param  {string}                    options.appName
 * @param  {string}                    options.appId
 * @param  {string}                    options.version
 * @param  {string}                    options.fileVersion        `version` in `X.X.X.X` form.
 * @param  {"ia32" | "x64" | "arm64"}  options.arch
 * @param  {string}                    options.installerPath      Absolute path the installer is written to.
 * @param  {string}                    [options.iconPath]         Absolute path to a `.ico` file.
 * @param  {string}                    [options.licensePath]      Absolute path to a `.txt` or `.rtf` file.
 * @param  {string}                    [options.publisher]
 * @param  {string}                    options.copyright
 * @param  {boolean}                   options.desktopShortcut
 * @param  {boolean}                   options.startMenuShortcut
 * @returns {string}
 */
function nsisScript({
  appDir,
  appFiles,
  appName,
  appId,
  version,
  fileVersion,
  arch,
  installerPath,
  iconPath,
  licensePath,
  publisher,
  copyright,
  desktopShortcut,
  startMenuShortcut,
}) {
  const e = util.nsisEscape;
  const p = util.nsisPath;
  /* Paths inside the install directory always use `\`, whichever host builds the installer. */
  const installed = (/** @type {string} */ relativePath) =>
    `"$INSTDIR\\${e(relativePath.split(path.sep).join("\\"))}"`;
  const uninstallKey = `"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${e(appId)}"`;
  const exe = installed(`${appName}.exe`);
  const archChecks = ARCH_CHECK_KV[arch];

  /** @type {string[]} */
  const lines = [
    "Unicode true",
    "ManifestDPIAware true",
    "RequestExecutionLevel user",
    "SetCompressor /SOLID lzma",
    "",
    '!include "MUI2.nsh"',
    '!include "LogicLib.nsh"',
    '!include "x64.nsh"',
    '!include "WinVer.nsh"',
    "",
    `Name "${e(appName)}"`,
    `OutFile "${p(installerPath)}"`,
    `InstallDir "$LOCALAPPDATA\\Programs\\${e(appName)}"`,
    `InstallDirRegKey HKCU ${uninstallKey} "InstallLocation"`,
    "",
  ];

  if (iconPath !== undefined) {
    lines.push(
      `!define MUI_ICON "${p(iconPath)}"`,
      `!define MUI_UNICON "${p(iconPath)}"`,
    );
  }
  lines.push(
    "!define MUI_ABORTWARNING",
    `!define MUI_FINISHPAGE_RUN ${exe}`,
    "",
    "!insertmacro MUI_PAGE_WELCOME",
  );
  if (licensePath !== undefined) {
    lines.push(`!insertmacro MUI_PAGE_LICENSE "${p(licensePath)}"`);
  }
  lines.push(
    "!insertmacro MUI_PAGE_DIRECTORY",
    "!insertmacro MUI_PAGE_INSTFILES",
    "!insertmacro MUI_PAGE_FINISH",
    "!insertmacro MUI_UNPAGE_CONFIRM",
    "!insertmacro MUI_UNPAGE_INSTFILES",
    '!insertmacro MUI_LANGUAGE "English"',
    "",
    `VIProductVersion "${fileVersion}"`,
    `VIFileVersion "${fileVersion}"`,
    `VIAddVersionKey "ProductName" "${e(appName)}"`,
    `VIAddVersionKey "ProductVersion" "${e(version)}"`,
    `VIAddVersionKey "FileVersion" "${e(version)}"`,
    `VIAddVersionKey "FileDescription" "${e(appName)} Setup"`,
    `VIAddVersionKey "LegalCopyright" "${e(copyright)}"`,
  );
  if (publisher !== undefined) {
    lines.push(`VIAddVersionKey "CompanyName" "${e(publisher)}"`);
  }
  lines.push("", "Function .onInit", "  SetShellVarContext current");
  if (archChecks.length > 0) {
    /* Passing branches are left empty: only the final `${Else}` does anything. */
    lines.push(
      ...archChecks.flatMap((checks, index) =>
        checks.map(
          (check, checkIndex) =>
            `  \${${checkIndex > 0 ? "AndIf" : index === 0 ? "If" : "ElseIf"}} ${check}`,
        ),
      ),
      "  ${Else}",
      `    MessageBox MB_ICONSTOP "This installer is for ${arch} Windows, which this computer can't run." /SD IDOK`,
      "    Abort",
      "  ${EndIf}",
    );
  }
  lines.push(
    "FunctionEnd",
    "",
    'Section "Install"',
    `  ReadRegStr $0 HKCU ${uninstallKey} "InstallLocation"`,
    '  ${If} $0 != ""',
    ...waitForAppToClose(`"$0\\${e(appName)}.exe"`, appName, "    "),
    "  ${EndIf}",
    ...waitForAppToClose(exe, appName, "  "),
    /*
     * Uninstall the previous version first, so files it had that this
     * version doesn't are removed. `_?=` runs its uninstaller in place and
     * waits for it, which leaves the uninstaller itself behind.
     */
    '  ${If} $0 != ""',
    '  ${AndIf} ${FileExists} "$0\\Uninstall.exe"',
    "    ClearErrors",
    `    ExecWait '"$0\\Uninstall.exe" /S _?=$0' $1`,
    "    ${If} ${Errors}",
    "    ${OrIf} $1 != 0",
    `      MessageBox MB_ICONSTOP "The previous version of ${e(appName)} couldn't be uninstalled." /SD IDOK`,
    "      Abort",
    "    ${EndIf}",
    '    Delete "$0\\Uninstall.exe"',
    '    RMDir "$0"',
    "  ${EndIf}",
    "",
    '  SetOutPath "$INSTDIR"',
  );

  /* Group files by directory: `File` writes into the current `SetOutPath`. */
  /** @type {Map<string, string[]>} */
  const filesByDir = new Map([["", []]]);
  for (const dir of appFiles.dirs) {
    filesByDir.set(dir, []);
  }
  for (const file of appFiles.files) {
    /** @type {string[]} */ (
      filesByDir.get(path.dirname(file).replace(/^\.$/, ""))
    ).push(file);
  }
  for (const [dir, files] of filesByDir) {
    if (dir !== "") {
      lines.push(`  SetOutPath ${installed(dir)}`);
    }
    for (const file of files) {
      lines.push(`  File "${p(path.join(appDir, file))}"`);
    }
  }

  lines.push(
    '  SetOutPath "$INSTDIR"',
    '  WriteUninstaller "$INSTDIR\\Uninstall.exe"',
    "",
  );
  if (startMenuShortcut) {
    lines.push(`  CreateShortcut "$SMPROGRAMS\\${e(appName)}.lnk" ${exe}`);
  }
  if (desktopShortcut) {
    lines.push(`  CreateShortcut "$DESKTOP\\${e(appName)}.lnk" ${exe}`);
  }
  lines.push(
    "",
    `  WriteRegStr HKCU ${uninstallKey} "DisplayName" "${e(appName)}"`,
    `  WriteRegStr HKCU ${uninstallKey} "DisplayVersion" "${e(version)}"`,
    `  WriteRegStr HKCU ${uninstallKey} "DisplayIcon" ${exe}`,
    `  WriteRegStr HKCU ${uninstallKey} "InstallLocation" "$INSTDIR"`,
    `  WriteRegStr HKCU ${uninstallKey} "UninstallString" '"$INSTDIR\\Uninstall.exe"'`,
    `  WriteRegStr HKCU ${uninstallKey} "QuietUninstallString" '"$INSTDIR\\Uninstall.exe" /S'`,
    `  WriteRegDWORD HKCU ${uninstallKey} "EstimatedSize" ${Math.ceil(appFiles.size / 1024)}`,
    `  WriteRegDWORD HKCU ${uninstallKey} "NoModify" 1`,
    `  WriteRegDWORD HKCU ${uninstallKey} "NoRepair" 1`,
  );
  if (publisher !== undefined) {
    lines.push(
      `  WriteRegStr HKCU ${uninstallKey} "Publisher" "${e(publisher)}"`,
    );
  }
  lines.push(
    "SectionEnd",
    "",
    "Function un.onInit",
    "  SetShellVarContext current",
    "FunctionEnd",
    "",
    'Section "Uninstall"',
    ...waitForAppToClose(exe, appName, "  "),
  );
  for (const file of appFiles.files) {
    lines.push(`  Delete ${installed(file)}`);
  }
  /* Children before parents, and `RMDir` without `/r` only removes empty directories. */
  for (const dir of [...appFiles.dirs].reverse()) {
    lines.push(`  RMDir ${installed(dir)}`);
  }
  lines.push(
    '  Delete "$INSTDIR\\Uninstall.exe"',
    '  RMDir "$INSTDIR"',
    `  Delete "$SMPROGRAMS\\${e(appName)}.lnk"`,
    `  Delete "$DESKTOP\\${e(appName)}.lnk"`,
    `  DeleteRegKey HKCU ${uninstallKey}`,
    "SectionEnd",
    "",
  );

  return lines.join("\n");
}

/**
 * Generate NSIS lines that wait until the application isn't running, asking
 * the user to close it, so its files can be replaced or deleted. Windows
 * refuses to open a running executable for writing, which is how a running
 * copy is detected. Cancelling - which silent mode does straight away -
 * aborts the installer or uninstaller. Uses `$2`.
 * @param  {string}  exePath  Quoted NSIS string with the executable's path, eg. `"$INSTDIR\Demo.exe"`.
 * @param  {string}  appName  Application name, shown in the prompt.
 * @param  {string}  indent   Indentation of the generated lines.
 * @returns {string[]}
 */
function waitForAppToClose(exePath, appName, indent) {
  return [
    "${Do}",
    `  \${IfNot} \${FileExists} ${exePath}`,
    "    ${Break}",
    "  ${EndIf}",
    "  ClearErrors",
    `  FileOpen $2 ${exePath} a`,
    "  ${IfNot} ${Errors}",
    "    FileClose $2",
    "    ${Break}",
    "  ${EndIf}",
    `  \${If} \${Cmd} \`MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Close ${util.nsisEscape(appName)}, then select Retry." /SD IDCANCEL IDCANCEL\``,
    "    Abort",
    "  ${EndIf}",
    "${Loop}",
  ].map((line) => `${indent}${line}`);
}

export default nsis;
export { listAppFiles, nsisScript };
