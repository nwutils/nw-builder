import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import util from "./util.js";

/**
 * @typedef  {object}                       DmgOptions
 * @property {string}                       appDir             Path to a built NW.js MacOS application, ie. the `outDir` produced by `@nwutils/builder` for `platform: "osx"`.
 * @property {string}                       appName            Name of the application. Must match the `app.name` value used to build `appDir` - the bundle is expected at `<appDir>/<appName>.app`.
 * @property {"x64" | "arm64"}              [arch]             Architecture `appDir` was built for. Defaults to the host architecture.
 * @property {string}                       [outDir]           Directory the resulting `<appName>-<arch>.dmg` file is written to. Defaults to the parent directory of `appDir`.
 * @property {string}                       [volumeName]       Name of the volume the DMG mounts as. Defaults to `appName`.
 * @property {string}                       [signIdentity]     Code signing identity, eg. `"Developer ID Application: ACME (TEAMID)"`, or `"-"` to sign ad-hoc. When set, the app is signed with `codesign` before it is put in the DMG. Sign here rather than before packaging when `publish` is set, since adding `app-update.yml` changes the bundle.
 * @property {string}                       [version]          Version of the application, eg. `"1.2.0"`. Required when `publish` is set: it is written to the update info file `@nwutils/updater` compares against.
 * @property {import("./appImage.js").PublishOptions} [publish] Where releases are published. When set, an `app-update.yml` pointing at it is added to the app's `Contents/Resources`, and a `<appName>-<arch>-mac.zip` update archive and a `latest-mac[-<arch>].yml` update info file are written next to the DMG, for `@nwutils/updater` to self update from.
 * @property {string}                       [hdiutilPath="hdiutil"]   Path to `hdiutil`, which creates the DMG.
 * @property {string}                       [dittoPath="ditto"]       Path to `ditto`, which creates the update archive.
 * @property {string}                       [codesignPath="codesign"] Path to `codesign`, which signs the app.
 */

/**
 * Package a built NW.js MacOS application as a DMG disk image.
 *
 * The DMG holds the app next to a link to `/Applications`, so users install it
 * by dragging the app onto the link. Updates don't use the DMG: with
 * `publish` set, a zip of the app is written next to it, which
 * `@nwutils/updater`'s `MacUpdater` downloads and swaps in for the running
 * app.
 *
 * This composes with `@nwutils/builder`: run it against the `outDir` (and
 * `app.name`) that `@nwutils/builder` produced for `platform: "osx"`.
 * `hdiutil`, `ditto` and `codesign` are part of MacOS, so this runs on a MacOS
 * host.
 * @async
 * @function
 * @param  {DmgOptions}  options
 * @returns {Promise<string>}  Path to the resulting `.dmg` file.
 */
async function dmg({
  appDir,
  appName,
  arch,
  outDir,
  volumeName,
  signIdentity,
  version,
  publish,
  hdiutilPath = "hdiutil",
  dittoPath = "ditto",
  codesignPath = "codesign",
}) {
  if (typeof appDir !== "string" || appDir === "") {
    throw new Error(
      `Expected "options.appDir" to be a non-empty string. Received: ${JSON.stringify(appDir)}`,
    );
  }

  if ((await util.fileExists(appDir)) === false) {
    throw new Error(`"options.appDir" does not exist: ${appDir}`);
  }

  /* `appName` names the bundle and the files written to `outDir`. */
  if (
    typeof appName !== "string" ||
    appName === "" ||
    appName.includes("/") ||
    appName.startsWith(".") ||
    hasControlCharacter(appName)
  ) {
    throw new Error(
      `Expected "options.appName" to be a non-empty file name without "/" or control characters, not starting with ".". Received: ${JSON.stringify(appName)}`,
    );
  }

  const resolvedArch =
    /** @type {"x64" | "arm64" | undefined} */ (arch) ??
    /** @type {"x64" | "arm64"} */ (/** @type {unknown} */ (process.arch));
  if (resolvedArch !== "x64" && resolvedArch !== "arm64") {
    throw new Error(
      `Expected "options.arch" to be "x64" or "arm64". Received: ${JSON.stringify(arch ?? process.arch)}`,
    );
  }

  const resolvedVolumeName = volumeName ?? appName;
  if (
    typeof resolvedVolumeName !== "string" ||
    resolvedVolumeName === "" ||
    hasControlCharacter(resolvedVolumeName)
  ) {
    throw new Error(
      `Expected "options.volumeName" to be a non-empty string without control characters. Received: ${JSON.stringify(volumeName)}`,
    );
  }

  if (
    signIdentity !== undefined &&
    (typeof signIdentity !== "string" || signIdentity === "")
  ) {
    throw new Error(
      `Expected "options.signIdentity" to be a non-empty string. Received: ${JSON.stringify(signIdentity)}`,
    );
  }

  if (publish !== undefined) {
    util.validatePublish(publish);
    if (typeof version !== "string" || version === "") {
      throw new Error(
        `Expected "options.version" to be a non-empty string when "options.publish" is set. Received: ${JSON.stringify(version)}`,
      );
    }
  }

  for (const [key, value] of Object.entries({
    hdiutilPath,
    dittoPath,
    codesignPath,
  })) {
    if (typeof value !== "string" || value === "") {
      throw new Error(
        `Expected "options.${key}" to be a non-empty string. Received: ${JSON.stringify(value)}`,
      );
    }
  }

  const resolvedAppDir = path.resolve(appDir);
  const appBundleName = `${appName}.app`;
  const appBundlePath = path.resolve(resolvedAppDir, appBundleName);
  if ((await util.fileExists(appBundlePath)) === false) {
    throw new Error(
      `Expected the app bundle to exist at ${appBundlePath}. Does "options.appName" match the "app.name" used to build "options.appDir" for "platform: \\"osx\\""?`,
    );
  }

  const resolvedOutDir = path.resolve(outDir ?? path.dirname(resolvedAppDir));
  await fs.promises.mkdir(resolvedOutDir, { recursive: true });
  const dmgPath = path.resolve(
    resolvedOutDir,
    `${appName}-${resolvedArch}.dmg`,
  );

  const stagingDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "nwutils-packager-dmg-"),
  );

  try {
    /* NW.js' frameworks are full of symbolic links, which must stay links for the signature to hold. */
    const stagedAppPath = path.resolve(stagingDir, appBundleName);
    await fs.promises.cp(appBundlePath, stagedAppPath, {
      recursive: true,
      verbatimSymlinks: true,
    });

    /*
     * `Contents/Resources` is where `@nwutils/updater` looks for it.
     * It's inside the signed bundle, so
     * signing comes after.
     */
    if (publish !== undefined) {
      await fs.promises.writeFile(
        path.resolve(stagedAppPath, "Contents", "Resources", "app-update.yml"),
        util.appUpdateYaml(publish),
      );
    }

    if (signIdentity !== undefined) {
      run(
        codesignPath,
        [
          "--force",
          "--deep",
          "--sign",
          signIdentity,
          /* Notarization requires the hardened runtime and a secure timestamp, which ad-hoc signatures can't have. */
          ...(signIdentity === "-"
            ? []
            : ["--options", "runtime", "--timestamp"]),
          stagedAppPath,
        ],
        "codesign",
        "codesignPath",
      );
    }

    /* Lets users install by dragging the app onto it. */
    await fs.promises.symlink(
      "/Applications",
      path.resolve(stagingDir, "Applications"),
    );

    run(
      hdiutilPath,
      [
        "create",
        "-volname",
        resolvedVolumeName,
        "-srcfolder",
        stagingDir,
        "-fs",
        "HFS+",
        "-format",
        "UDZO",
        "-ov",
        dmgPath,
      ],
      "hdiutil",
      "hdiutilPath",
    );

    if (publish !== undefined) {
      /*
       * `ditto` keeps the permissions, symbolic links and extended attributes
       * a signed app bundle needs, unlike most zip tools. `--keepParent` puts
       * `<appName>.app` itself at the archive's root.
       */
      const zipPath = path.resolve(
        resolvedOutDir,
        `${appName}-${resolvedArch}-mac.zip`,
      );
      run(
        dittoPath,
        ["-c", "-k", "--sequesterRsrc", "--keepParent", stagedAppPath, zipPath],
        "ditto",
        "dittoPath",
      );
      await util.writeUpdateInfo({
        filePath: zipPath,
        updateInfoPath: path.resolve(
          resolvedOutDir,
          util.updateInfoFileName(resolvedArch, "osx"),
        ),
        version: /** @type {string} */ (version),
      });
    }

    return dmgPath;
  } finally {
    await fs.promises.rm(stagingDir, { recursive: true, force: true });
  }
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function hasControlCharacter(value) {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });
}

/**
 * Run a MacOS tool, turning a missing tool into an error that says so.
 * @param {string} toolPath  Path or name of the tool.
 * @param {string[]} args
 * @param {string} toolName  eg. `"hdiutil"`.
 * @param {string} optionName  Option that overrides `toolPath`, eg. `"hdiutilPath"`.
 * @returns {void}
 */
function run(toolPath, args, toolName, optionName) {
  try {
    child_process.execFileSync(toolPath, args, { stdio: "inherit" });
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") {
      throw new Error(
        `Could not find ${JSON.stringify(toolPath)}. "${toolName}" is part of MacOS, so DMGs are built on a MacOS host. Otherwise pass its path as "options.${optionName}".`,
        { cause: error },
      );
    }
    throw error;
  }
}

export default dmg;
