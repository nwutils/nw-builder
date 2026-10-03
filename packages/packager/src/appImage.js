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
 * @property {string}                       appName            Name of the application. Must match the `app.name` value used to build `appDir` - the executable and desktop entry are expected at `<appDir>/<appName>` and `<appDir>/<appName>.desktop`. Must not contain `/` or control characters.
 * @property {string}                       [icon]             Path to a `.png` or `.svg` icon. Defaults to the `Icon` value read from `<appDir>/<appName>.desktop`.
 * @property {"ia32" | "x64" | "arm64"}     [arch]             Target architecture. Defaults to the host architecture. `appimagetool` runs as a native binary, so this must match the host unless the host has emulation (eg. QEMU/binfmt) configured for the target architecture.
 * @property {string}                       [outDir]           Directory the resulting `.AppImage` file is written to. Defaults to the parent directory of `appDir`.
 * @property {string}                       [cacheDir="./cache"] Directory used to cache the downloaded `appimagetool` binary.
 * @property {boolean}                      [cache=true]       If true, reuse a cached `appimagetool` binary. Otherwise redownload it.
 * @property {string}                       [appImageToolUrl]  Base URL `appimagetool-<arch>.AppImage` is downloaded from. Defaults to the `AppImage/appimagetool` "continuous" GitHub release. Must be https, except for localhost.
 * @property {boolean}                      [sign=false]       If true, embed a GPG signature in the AppImage. Requires `gpg` and a usable secret key on the host. A passphrase-protected key reads its passphrase from the `APPIMAGETOOL_SIGN_PASSPHRASE` environment variable.
 * @property {string}                       [signKey]          ID of the GPG key to sign with. Defaults to `gpg`'s default secret key. Requires `sign` to be true.
 * @property {string}                       [version]          Version of the application, eg. `"1.2.0"`. Required when `publish` is set: it is written to the update info file `@nwutils/updater` compares against.
 * @property {PublishOptions}               [publish]          Where releases are published. When set, an `app-update.yml` pointing at it is embedded in the AppImage and a `latest-linux[-<arch>].yml` update info file is written next to it, for `@nwutils/updater` to self update from.
 * @property {string | boolean}             [updateInformation] AppImage update information for zsync based updaters (eg. AppImageUpdate, `appimageupdatetool`, AppImage managers). `true` derives it from `publish`. A string is embedded as-is, eg. `"gh-releases-zsync|owner|repo|latest|Demo-x86_64.AppImage.zsync"`. Requires `zsyncmake` on the host to produce the `.zsync` file.
 */

/**
 * Publish to a GitHub repository's releases. The AppImage and update info
 * file must be uploaded as assets of the latest (non draft, non prerelease)
 * release.
 * @typedef  {object}   GitHubPublishOptions
 * @property {"github"} provider
 * @property {string}   owner     Owner of the GitHub repository.
 * @property {string}   repo      Name of the GitHub repository.
 */

/**
 * Publish to any static file server. The AppImage and update info file must
 * be served from `url`.
 * @typedef  {object}    GenericPublishOptions
 * @property {"generic"} provider
 * @property {string}    url       Base URL the latest release's files are served from.
 */

/**
 * @typedef {GitHubPublishOptions | GenericPublishOptions} PublishOptions
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
  sign = false,
  signKey,
  version,
  publish,
  updateInformation,
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
  /*
   * `appName` names files inside `appDir` and `outDir`, and is written into
   * the desktop entry and `AppRun`: a path separator or `..` would reach
   * outside those directories, and a line break would inject desktop entries.
   */
  const hasControlCharacter = [...appName].some((character) => {
    const code = character.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });
  if (
    appName.includes("/") ||
    hasControlCharacter ||
    appName === "." ||
    appName === ".."
  ) {
    throw new Error(
      `Expected "options.appName" to be a file name without "/" or control characters. Received: ${JSON.stringify(appName)}`,
    );
  }

  if (typeof sign !== "boolean") {
    throw new Error(
      `Expected "options.sign" to be a boolean. Received: ${JSON.stringify(sign)}`,
    );
  }

  if (signKey !== undefined) {
    if (typeof signKey !== "string" || signKey === "") {
      throw new Error(
        `Expected "options.signKey" to be a non-empty string. Received: ${JSON.stringify(signKey)}`,
      );
    }
    if (sign === false) {
      throw new Error(
        '"options.signKey" was passed but "options.sign" is false. Set "options.sign" to true to sign the AppImage.',
      );
    }
  }

  if (publish !== undefined) {
    validatePublish(publish);
    if (typeof version !== "string" || version === "") {
      throw new Error(
        `Expected "options.version" to be a non-empty string when "options.publish" is set. Received: ${JSON.stringify(version)}`,
      );
    }
  }

  if (
    updateInformation !== undefined &&
    typeof updateInformation !== "boolean" &&
    (typeof updateInformation !== "string" || updateInformation === "")
  ) {
    throw new Error(
      `Expected "options.updateInformation" to be a boolean or a non-empty string. Received: ${JSON.stringify(updateInformation)}`,
    );
  }
  if (updateInformation === true && publish === undefined) {
    throw new Error(
      '"options.updateInformation" is true but "options.publish" is not set. Set "options.publish" to derive it, or pass the update information string directly.',
    );
  }

  const resolvedArch =
    /** @type {"ia32" | "x64" | "arm64" | undefined} */ (arch) ??
    /** @type {"ia32" | "x64" | "arm64"} */ (
      /** @type {unknown} */ (process.arch)
    );

  /* `Object.hasOwn` so inherited keys such as "constructor" aren't mistaken for architectures. */
  const appImageToolArch = Object.hasOwn(util.APPIMAGE_ARCH_KV, resolvedArch)
    ? util.APPIMAGE_ARCH_KV[resolvedArch]
    : undefined;
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
      Exec: util.desktopExecArg(appName),
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
        /* Single quoted, so the app name is never expanded or run by the shell. */
        `exec "\${HERE}"/${util.shellQuote(appName)} "$@"`,
        "",
      ].join("\n"),
    );
    await fs.promises.chmod(appRunPath, 0o755);

    /*
     * Sits next to the NW.js executable, ie. at
     * `path.dirname(process.execPath)` at runtime, which is where
     * `@nwutils/updater` looks for it.
     */
    if (publish !== undefined) {
      await fs.promises.writeFile(
        path.resolve(appImageDir, "app-update.yml"),
        util.stringifyYaml(
          publish.provider === "github"
            ? {
                provider: publish.provider,
                owner: publish.owner,
                repo: publish.repo,
              }
            : { provider: publish.provider, url: publish.url },
        ),
      );
    }

    const appImageFileName = `${appName}-${appImageToolArch}.AppImage`;
    const appImageFilePath = path.resolve(resolvedOutDir, appImageFileName);
    const zsyncFilePath = `${appImageFilePath}.zsync`;

    const resolvedUpdateInformation =
      updateInformation === true
        ? deriveUpdateInformation(
            /** @type {PublishOptions} */ (publish),
            path.basename(zsyncFilePath),
          )
        : updateInformation || undefined;

    /*
     * Signing happens inside the same `appimagetool` run that builds the
     * file: an embedded signature can't be added to an existing AppImage.
     */
    const signArgs = sign
      ? ["--sign", ...(signKey === undefined ? [] : ["--sign-key", signKey])]
      : [];

    const updateInformationArgs =
      resolvedUpdateInformation === undefined
        ? []
        : ["--updateinformation", resolvedUpdateInformation];

    if (resolvedUpdateInformation !== undefined) {
      /* Don't let a `.zsync` file left over from a previous build pass the check below. */
      await fs.promises.rm(zsyncFilePath, { force: true });
    }

    child_process.execFileSync(
      appImageToolPath,
      [
        "--no-appstream",
        ...signArgs,
        ...updateInformationArgs,
        appImageDir,
        appImageFilePath,
      ],
      {
        /*
         * `appimagetool` runs `zsyncmake` without an output path, which
         * writes the `.zsync` file to the working directory - run from
         * `outDir` so it lands next to the AppImage.
         */
        cwd: resolvedOutDir,
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

    /*
     * `appimagetool` only warns, and still exits successfully, when it
     * can't find `zsyncmake` - leaving an AppImage that advertises a
     * `.zsync` file which was never produced.
     */
    if (
      resolvedUpdateInformation !== undefined &&
      (await util.fileExists(zsyncFilePath)) === false
    ) {
      throw new Error(
        `"appimagetool" did not produce ${zsyncFilePath}. Install "zsyncmake" (usually packaged as "zsync") on the host to build AppImages with "options.updateInformation".`,
      );
    }

    if (publish !== undefined) {
      const appImageSha512 = await util.sha512(appImageFilePath);
      const { size } = await fs.promises.stat(appImageFilePath);
      await fs.promises.writeFile(
        path.resolve(resolvedOutDir, util.updateInfoFileName(resolvedArch)),
        util.stringifyYaml({
          version: /** @type {string} */ (version),
          files: [{ url: appImageFileName, sha512: appImageSha512, size }],
          path: appImageFileName,
          sha512: appImageSha512,
          releaseDate: new Date().toISOString(),
        }),
      );
    }

    return appImageFilePath;
  } finally {
    await fs.promises.rm(appImageDir, { recursive: true, force: true });
  }
}

/**
 * Throw if `publish` isn't a valid `PublishOptions` object.
 * @param {unknown} publish
 * @returns {asserts publish is PublishOptions}
 */
function validatePublish(publish) {
  if (typeof publish !== "object" || publish === null) {
    throw new Error(
      `Expected "options.publish" to be an object. Received: ${JSON.stringify(publish)}`,
    );
  }

  const { provider } = /** @type {{provider?: unknown}} */ (publish);
  /** @type {string[]} */
  let requiredKeys;
  if (provider === "github") {
    requiredKeys = ["owner", "repo"];
  } else if (provider === "generic") {
    requiredKeys = ["url"];
  } else {
    throw new Error(
      `Expected "options.publish.provider" to be "github" or "generic". Received: ${JSON.stringify(provider)}`,
    );
  }

  for (const key of requiredKeys) {
    const value = /** @type {Record<string, unknown>} */ (publish)[key];
    if (typeof value !== "string" || value === "") {
      throw new Error(
        `Expected "options.publish.${key}" to be a non-empty string for provider "${provider}". Received: ${JSON.stringify(value)}`,
      );
    }
  }

  if (provider === "github") {
    /*
     * The characters GitHub allows in owner and repository names. Anything
     * else - eg. "|", the update information's field separator - is rejected.
     */
    for (const key of requiredKeys) {
      const value = /** @type {Record<string, string>} */ (publish)[key];
      if (/^[A-Za-z0-9._-]+$/.test(value) === false) {
        throw new Error(
          `Expected "options.publish.${key}" to be a GitHub ${key} name (letters, digits, ".", "-" and "_"). Received: ${JSON.stringify(value)}`,
        );
      }
    }
  }

  if (provider === "generic") {
    const { url } = /** @type {GenericPublishOptions} */ (publish);
    let protocol;
    try {
      protocol = new URL(url).protocol;
    } catch {
      protocol = undefined;
    }
    if (protocol !== "https:" && protocol !== "http:") {
      throw new Error(
        `Expected "options.publish.url" to be an http(s) URL. Received: ${JSON.stringify(url)}`,
      );
    }
  }
}

/**
 * Build the AppImage update information string for `publish`, in the format
 * zsync based AppImage updaters understand.
 * @param {PublishOptions} publish
 * @param {string} zsyncFileName  Name the `.zsync` file is published under.
 * @returns {string}
 */
function deriveUpdateInformation(publish, zsyncFileName) {
  if (publish.provider === "github") {
    return `gh-releases-zsync|${publish.owner}|${publish.repo}|latest|${zsyncFileName}`;
  }
  /* Trim trailing slashes with a linear scan rather than a backtracking regular expression. */
  let end = publish.url.length;
  while (end > 0 && publish.url[end - 1] === "/") {
    end--;
  }
  return `zsync|${publish.url.slice(0, end)}/${zsyncFileName}`;
}

/**
 * Throw unless `appImageToolUrl` is an https URL. The downloaded binary is
 * executed, so a plain http download would let anyone on the network path
 * replace it. http is only accepted for loopback hosts, eg. a local mirror.
 * @param {string} appImageToolUrl
 * @returns {void}
 */
function validateAppImageToolUrl(appImageToolUrl) {
  let url;
  try {
    url = new URL(appImageToolUrl);
  } catch {
    url = undefined;
  }
  const isLoopback =
    url !== undefined &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    url === undefined ||
    (url.protocol !== "https:" && (url.protocol !== "http:" || !isLoopback))
  ) {
    throw new Error(
      `Expected "options.appImageToolUrl" to be an https URL (http is only allowed for localhost). Received: ${JSON.stringify(appImageToolUrl)}`,
    );
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
  validateAppImageToolUrl(appImageToolUrl);

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
