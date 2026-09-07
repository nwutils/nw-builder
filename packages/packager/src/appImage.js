import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import request from "./request.js";
import util from "./util.js";

/**
 * Default location `appimagetool` is downloaded from. The `continuous` tag
 * is rebuilt on every push to the default branch and publishes one asset per
 * architecture, eg. `appimagetool-x86_64.AppImage`.
 * @type {string}
 */
const APPIMAGETOOL_URL =
  "https://github.com/AppImage/appimagetool/releases/download/continuous";

/**
 * @typedef  {object}                       AppImageOptions
 * @property {string}                       appDir             Path to a built NW.js Linux application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "linux"`.
 * @property {string}                       appName            Name of the application. Must match the `app.name` value used to build `appDir` - the executable and desktop entry are expected at `<appDir>/<appName>` and `<appDir>/<appName>.desktop`.
 * @property {string}                       [icon]             Path to a `.png` or `.svg` icon. Defaults to the `Icon` value read from `<appDir>/<appName>.desktop`.
 * @property {"ia32" | "x64" | "arm64"}     [arch]             Target architecture. Defaults to the host architecture. `appimagetool` runs as a native binary, so this must match the host unless the host has emulation (eg. QEMU/binfmt) configured for the target architecture.
 * @property {string}                       [outDir]           Directory the resulting `.AppImage` file is written to. Defaults to the parent directory of `appDir`.
 * @property {string}                       [cacheDir="./cache"] Directory used to cache the downloaded `appimagetool` binary.
 * @property {boolean}                      [cache=true]       If true, reuse a cached `appimagetool` binary. Otherwise redownload it.
 * @property {string}                       [appImageToolUrl]  Base URL `appimagetool-<arch>.AppImage` is downloaded from. Defaults to the `AppImage/appimagetool` "continuous" GitHub release.
 */

/**
 * Package a built NW.js Linux application as an AppImage.
 *
 * This composes with `@nwutils/builder`: run it against the `outDir` (and
 * `app.name`) that `@nwutils/builder` produced for `platform: "linux"`.
 * @async
 * @function
 * @param  {AppImageOptions}  options
 * @returns {Promise<string>}  Path to the resulting `.AppImage` file.
 */
async function appImage({
  appDir,
  appName,
  icon,
  arch,
  outDir,
  cacheDir = "./cache",
  cache = true,
  appImageToolUrl = APPIMAGETOOL_URL,
}) {
  if (process.platform !== "linux") {
    throw new Error(
      `AppImage packaging requires a Linux host, since "appimagetool" is a native Linux binary. Received host platform: ${process.platform}`,
    );
  }

  if (typeof appDir !== "string" || appDir === "") {
    throw new Error(
      `Expected "options.appDir" to be a non-empty string. Received: ${JSON.stringify(appDir)}`,
    );
  }

  if ((await util.fileExists(appDir)) === false) {
    throw new Error(`"options.appDir" does not exist: ${appDir}`);
  }

  if (typeof appName !== "string" || appName === "") {
    throw new Error(
      `Expected "options.appName" to be a non-empty string. Received: ${JSON.stringify(appName)}`,
    );
  }

  const resolvedArch =
    /** @type {"ia32" | "x64" | "arm64" | undefined} */ (arch) ??
    /** @type {"ia32" | "x64" | "arm64"} */ (
      /** @type {unknown} */ (process.arch)
    );

  const appImageToolArch = util.APPIMAGE_ARCH_KV[resolvedArch];
  if (appImageToolArch === undefined) {
    throw new Error(
      `Expected "options.arch" to be "ia32", "x64" or "arm64". Received: ${JSON.stringify(arch)}`,
    );
  }

  const resolvedAppDir = path.resolve(appDir);
  const executablePath = path.resolve(resolvedAppDir, appName);
  if ((await util.fileExists(executablePath)) === false) {
    throw new Error(
      `Expected the NW.js executable to exist at ${executablePath}. Does "options.appName" match the "app.name" used to build "options.appDir"?`,
    );
  }

  const desktopFilePath = path.resolve(resolvedAppDir, `${appName}.desktop`);
  if ((await util.fileExists(desktopFilePath)) === false) {
    throw new Error(
      `Expected a desktop entry file to exist at ${desktopFilePath}. Build "options.appDir" with "@nwutils/builder" for "platform: \\"linux\\"" first.`,
    );
  }
  const desktopEntry = util.parseDesktopEntry(
    await fs.promises.readFile(desktopFilePath, "utf-8"),
  );

  const resolvedIcon = icon ?? desktopEntry.Icon;
  if (resolvedIcon === undefined || resolvedIcon === "") {
    throw new Error(
      'AppImage packaging requires an icon. Pass "options.icon", or ensure the "Icon" key in the desktop entry file points at an existing file.',
    );
  }
  const resolvedIconPath = path.resolve(resolvedIcon);
  if ((await util.fileExists(resolvedIconPath)) === false) {
    throw new Error(`"options.icon" does not exist: ${resolvedIconPath}`);
  }

  const resolvedOutDir = path.resolve(outDir ?? path.dirname(resolvedAppDir));
  await fs.promises.mkdir(resolvedOutDir, { recursive: true });

  const resolvedCacheDir = path.resolve(cacheDir);
  const appImageToolPath = await getAppImageTool({
    appImageToolArch,
    appImageToolUrl,
    cacheDir: resolvedCacheDir,
    cache,
  });

  const appImageDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "nwutils-packager-"),
  );

  try {
    await fs.promises.cp(resolvedAppDir, appImageDir, {
      recursive: true,
      force: true,
      verbatimSymlinks: true,
    });

    const iconFileName = path.basename(resolvedIconPath);
    await fs.promises.cp(
      resolvedIconPath,
      path.resolve(appImageDir, iconFileName),
      { force: true },
    );

    /*
     * `Exec` and `Icon` are rewritten unconditionally: `Exec` may be unset or
     * point at something other than the renamed binary, and `Icon` is an
     * absolute build-time path - neither survives being relocated into an
     * AppImage, whose root is what ends up mounted at runtime. `Categories`
     * is only filled in when absent: `appimagetool` refuses to build an
     * AppImage without one, but `@nwutils/builder`'s `app.categories` is
     * optional, so most callers won't have set it.
     */
    const appImageDesktopEntry = {
      ...desktopEntry,
      Name: desktopEntry.Name ?? appName,
      Exec: appName,
      Icon: path.basename(iconFileName, path.extname(iconFileName)),
      Categories: desktopEntry.Categories || "Utility;",
    };
    await fs.promises.writeFile(
      path.resolve(appImageDir, `${appName}.desktop`),
      util.stringifyDesktopEntry(appImageDesktopEntry),
    );

    const appRunPath = path.resolve(appImageDir, "AppRun");
    await fs.promises.writeFile(
      appRunPath,
      [
        "#!/bin/sh",
        'HERE="$(dirname "$(readlink -f "${0}")")"',
        `exec "\${HERE}/${appName}" "$@"`,
        "",
      ].join("\n"),
    );
    await fs.promises.chmod(appRunPath, 0o755);

    const appImageFilePath = path.resolve(
      resolvedOutDir,
      `${appName}-${appImageToolArch}.AppImage`,
    );

    child_process.execFileSync(
      appImageToolPath,
      ["--no-appstream", appImageDir, appImageFilePath],
      {
        env: {
          ...process.env,
          ARCH: appImageToolArch,
          /*
           * `appimagetool` is itself distributed as an AppImage. Extract and
           * run it directly instead of mounting it via FUSE, which is
           * frequently unavailable in containers, CI runners and sandboxes.
           */
          APPIMAGE_EXTRACT_AND_RUN: "1",
        },
        stdio: "inherit",
      },
    );

    return appImageFilePath;
  } finally {
    await fs.promises.rm(appImageDir, { recursive: true, force: true });
  }
}

/**
 * Download (or reuse a cached) `appimagetool` binary for `appImageToolArch`.
 * @async
 * @function
 * @param  {object}  options
 * @param  {string}  options.appImageToolArch  `appimagetool` architecture identifier, eg. "x86_64".
 * @param  {string}  options.appImageToolUrl   Base URL to download `appimagetool-<arch>.AppImage` from.
 * @param  {string}  options.cacheDir          Directory used to cache the downloaded binary.
 * @param  {boolean} options.cache             If true, reuse a cached binary. Otherwise redownload it.
 * @returns {Promise<string>}  Path to an executable `appimagetool` binary.
 */
async function getAppImageTool({
  appImageToolArch,
  appImageToolUrl,
  cacheDir,
  cache,
}) {
  const appImageToolPath = path.resolve(
    cacheDir,
    `appimagetool-${appImageToolArch}.AppImage`,
  );

  if (cache === false) {
    await fs.promises.rm(appImageToolPath, { force: true });
  }

  if ((await util.fileExists(appImageToolPath)) === false) {
    await fs.promises.mkdir(cacheDir, { recursive: true });
    await request(
      `${appImageToolUrl}/appimagetool-${appImageToolArch}.AppImage`,
      appImageToolPath,
    );

    /*
     * `appimagetool-<arch>.AppImage` has no published checksum to verify
     * against (the "continuous" release is rebuilt in place). Checking the
     * ELF magic bytes at least catches an HTML error page or truncated
     * download being saved and later executed as though it were the tool.
     */
    const magic = Buffer.alloc(4);
    const fileHandle = await fs.promises.open(appImageToolPath, "r");
    try {
      await fileHandle.read(magic, 0, 4, 0);
    } finally {
      await fileHandle.close();
    }
    if (magic.toString("hex") !== "7f454c46") {
      await fs.promises.rm(appImageToolPath, { force: true });
      throw new Error(
        `Downloaded "appimagetool" from ${appImageToolUrl}/appimagetool-${appImageToolArch}.AppImage does not look like an ELF binary.`,
      );
    }
  }

  await fs.promises.chmod(appImageToolPath, 0o755);

  return appImageToolPath;
}

export default appImage;
export { getAppImageTool };
