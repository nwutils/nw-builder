import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * @typedef {"normal" | "sdk"} Flavor
 * @typedef {"x64"} Arch
 */

/** Platforms and architectures the build is wired up for so far. */
export const SUPPORTED = /** @type {const} */ ({ linux: ["x64"] });

/**
 * Validates an NW.js version, e.g. "0.120.0" or "v0.120.0-beta1", and returns
 * it without the leading "v". The version ends up in git arguments (the
 * release tag), so anything else is rejected rather than passed on.
 *
 * @param {string} version - Version to check.
 * @returns {string} The version without a leading "v".
 */
export function parseVersion(version) {
  const match = /^v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)$/.exec(version);
  if (!match) {
    throw new Error(`Invalid NW.js version: ${JSON.stringify(version)}`);
  }
  return match[1];
}

/**
 * Reads a `vars` entry, such as `nw_src_revision`, from a DEPS file.
 *
 * @param {string} deps - Contents of the DEPS file.
 * @param {string} name - Variable name.
 * @returns {string | undefined} Its value, if set.
 */
export function depsVar(deps, name) {
  const match = deps.match(
    new RegExp(`['"]${name}['"]\\s*:\\s*['"]([^'"]+)['"]`),
  );
  return match?.[1];
}

/**
 * Builds the .gclient file NW.js's own tools/sync.py uses: Chromium from NW's
 * fork at the pinned revision, with NW's DEPS (src/content/nw/DEPS) in place
 * of Chromium's, which swaps in NW's V8 and adds Node.js and NW's patches.
 * The "small" checkout configuration skips benchmark suites and GPU test data.
 *
 * @param {string} revision - nw_src_revision from NW's DEPS.
 * @returns {string} Contents for the .gclient file in the gclient root.
 */
export function gclientFile(revision) {
  return `solutions = [{"managed": False, "name": "src", "url": "https://github.com/nwjs/chromium.src.git@${revision}", "custom_deps": {}, "deps_file": "content/nw/DEPS", "safesync_url": "", "custom_vars": {"download_reclient": False, "non_git_source": True, "checkout_configuration": "small"}}]\n`;
}

/**
 * The ninja targets (in out/nw) that produce every file NW.js packages:
 * the nwjs group, the credits page, ANGLE and Vulkan/SwiftShader, plus nwjc,
 * chromedriver and minidump_stackwalk for the SDK. NW's own \`dist\` target
 * also builds and dumps debug symbols for all of these, which a CI build
 * doesn't need.
 *
 * @param {Flavor} flavor - "normal" or "sdk".
 * @returns {string[]} Ninja target names.
 */
export function packageTargets(flavor) {
  const targets = [
    "nwjs",
    "components/resources:about_credits_nw",
    "third_party/angle:libEGL",
    "third_party/angle:libGLESv2",
    "third_party/vulkan-loader/src:libvulkan",
    "third_party/swiftshader/src/Vulkan:swiftshader_libvulkan",
  ];
  if (flavor === "sdk") {
    targets.push(
      "v8:nwjc",
      "chrome/test/chromedriver:chromedriver_server",
      "third_party/breakpad:minidump_stackwalk",
    );
  }
  return targets;
}

/**
 * GN args for the NW.js build, following NW's official flags (release,
 * component ffmpeg) with settings that keep CI builds tractable: no debug
 * symbols, no remote execution, and an optional compiler cache.
 *
 * @param {object} options
 * @param {Arch} options.arch - Target CPU.
 * @param {Flavor} options.flavor - "normal" or "sdk" (DevTools and nw:// URLs).
 * @param {string} [options.ccWrapper] - Compiler wrapper, e.g. "sccache".
 * @returns {string} Contents for out/nw/args.gn.
 */
export function argsGn({ arch, flavor, ccWrapper }) {
  const args = {
    is_debug: false,
    is_component_ffmpeg: true,
    target_cpu: `"${arch}"`,
    nwjs_sdk: flavor === "sdk",
    symbol_level: 0,
    blink_symbol_level: 0,
    v8_symbol_level: 0,
    use_remoteexec: false,
    use_siso: false,
    // A newer compiler warning shouldn't fail a day-long build.
    treat_warnings_as_errors: false,
    // sccache can't cache compiles that use Clang header modules, which
    // Chromium turns on by default on Linux, so turn them off with a cache.
    ...(ccWrapper
      ? { cc_wrapper: `"${ccWrapper}"`, use_clang_modules: false }
      : {}),
  };
  return Object.entries(args)
    .map(([key, value]) => `${key} = ${value}`)
    .join("\n")
    .concat("\n");
}

/**
 * GYP_DEFINES for NW's Node.js build, as in NW's "Building NW.js" docs, with
 * nwjs_sdk matching the GN flavor.
 *
 * @param {object} options
 * @param {Arch} options.arch - Target CPU.
 * @param {Flavor} options.flavor - "normal" or "sdk".
 * @returns {string} Space-separated defines.
 */
export function gypDefines({ arch, flavor }) {
  return [
    `target_arch=${arch}`,
    "building_nw=1",
    "clang=1",
    "icu_use_data_file_flag=1",
    `host_arch=${arch}`,
    `nwjs_sdk=${flavor === "sdk" ? 1 : 0}`,
    "disable_nacl=0",
    "buildtype=Official",
  ].join(" ");
}

/**
 * Milliseconds left before `stopAt`, never negative.
 *
 * @param {number | undefined} stopAt - Unix time in milliseconds, or undefined for no limit.
 * @param {number} [now] - Current time in milliseconds.
 * @returns {number} Time left, Infinity without a limit.
 */
export function remainingMs(stopAt, now = Date.now()) {
  return stopAt === undefined ? Infinity : Math.max(0, stopAt - now);
}

/**
 * Parses ninja's dry-run output (`ninja -n`) into the number of steps left.
 *
 * @param {string} output - Output of `ninja -n`.
 * @returns {number} Steps left; 0 when ninja has no work to do.
 */
export function stepsLeft(output) {
  if (/no work to do/.test(output)) {
    return 0;
  }
  let last = 0;
  for (const match of output.matchAll(/^\[(\d+)\/(\d+)\]/gm)) {
    last = Number(match[2]);
  }
  return last;
}

/**
 * Throws unless the host can build NW.js with these tools yet.
 *
 * @param {string} platform - process.platform.
 * @param {string} arch - Target CPU.
 * @returns {void}
 */
export function assertSupported(platform, arch) {
  const arches = /** @type {Record<string, readonly string[]>} */ (SUPPORTED)[
    platform
  ];
  if (!arches?.includes(arch)) {
    throw new Error(
      `Building NW.js for ${platform} ${arch} is not supported yet (supported: Linux x64).`,
    );
  }
}

/**
 * Runs a command, streaming its output, and resolves with how it ended. With
 * `stopAt`, the command is interrupted (SIGINT, as Ctrl+C would) once the time
 * comes, so a CI job can save its progress before its time limit; whatever
 * still runs `graceMs` later is killed.
 *
 * The command runs in its own process group and is stopped as a group:
 * depot_tools' `ninja` is a bash script that runs Python, which runs ninja,
 * and bash doesn't pass a SIGINT on to the command it is waiting for. A
 * Ctrl+C or SIGTERM sent to this process is passed on to the group too.
 *
 * @param {string} command - Executable.
 * @param {string[]} args - Arguments.
 * @param {object} options
 * @param {string} options.cwd - Working directory.
 * @param {NodeJS.ProcessEnv} options.env - Environment.
 * @param {number} [options.stopAt] - Unix time in milliseconds to stop at.
 * @param {number} [options.graceMs] - How long to wait after the SIGINT
 *   before killing what's left (default 60s).
 * @returns {Promise<"done" | "stopped">} "stopped" if the deadline interrupted it.
 */
export function run(command, args, { cwd, env, stopAt, graceMs = 60_000 }) {
  return new Promise((resolve, reject) => {
    const left = remainingMs(stopAt);
    if (left === 0) {
      resolve("stopped");
      return;
    }
    console.log(`$ ${command} ${args.join(" ")}`);
    const group = process.platform !== "win32";
    const child = child_process.spawn(command, args, {
      cwd,
      env,
      stdio: "inherit",
      detached: group,
    });
    /** @param {NodeJS.Signals} signal */
    const signalAll = (signal) => {
      try {
        if (group && child.pid !== undefined) {
          process.kill(-child.pid, signal);
        } else {
          child.kill(signal);
        }
      } catch {
        // Already gone.
      }
    };
    // A separate process group doesn't get the terminal's Ctrl+C.
    process.on("SIGINT", signalAll);
    process.on("SIGTERM", signalAll);

    let stopped = false;
    /** @type {NodeJS.Timeout | undefined} */
    let kill;
    const timer =
      left === Infinity
        ? undefined
        : setTimeout(() => {
            stopped = true;
            console.log(
              `Time is up: stopping ${command} so progress can be saved.`,
            );
            signalAll("SIGINT");
            kill = setTimeout(() => {
              console.log(`${command} is still running: killing it.`);
              signalAll("SIGKILL");
            }, graceMs);
          }, left);
    const done = () => {
      clearTimeout(timer);
      clearTimeout(kill);
      process.off("SIGINT", signalAll);
      process.off("SIGTERM", signalAll);
    };
    child.on("error", (error) => {
      done();
      reject(error);
    });
    child.on("close", (code, signal) => {
      done();
      if (stopped) {
        // Whatever the group left behind (e.g. ninja's compilers) goes too.
        signalAll("SIGKILL");
        resolve("stopped");
      } else if (code === 0) {
        resolve("done");
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed (${signal ?? `exit code ${code}`})`,
          ),
        );
      }
    });
  });
}

/**
 * Runs a command and returns its standard output.
 *
 * @param {string} command - Executable.
 * @param {string[]} args - Arguments.
 * @param {object} options
 * @param {string} options.cwd - Working directory.
 * @param {NodeJS.ProcessEnv} options.env - Environment.
 * @returns {string} Standard output.
 */
export function capture(command, args, { cwd, env }) {
  return child_process.execFileSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 1 << 30,
  });
}

/**
 * Whether a path exists.
 *
 * @param {string} path - File or directory.
 * @returns {boolean} True if it exists.
 */
export function exists(path) {
  return fs.existsSync(path);
}

/**
 * Where each nwjs repository's patches apply, relative to the gclient root.
 * These are the git checkouts gclient creates, so a patch made with
 * `git format-patch` in a clone of that repository applies (and can be sent
 * upstream) unchanged.
 */
export const PATCH_TARGETS = /** @type {const} */ ({
  "nw.js": "src/content/nw",
  "chromium.src": "src",
  node: "src/third_party/node-nw",
  v8: "src/v8",
});

/**
 * The folder, next to the issue folders, for fixes to NW.js's own build that
 * no NW.js issue covers (e.g. a missing build dependency). It holds patches
 * only, no test, and they are applied before the issues' patches.
 */
export const BUILD_FIXES = "build";

/**
 * Lists the issue folders in `issuesDir`, sorted. Folders starting with "_"
 * or "." (such as the template) are skipped, and so is BUILD_FIXES, which
 * isn't an issue.
 *
 * @param {string} issuesDir - Directory with one folder per issue.
 * @returns {string[]} Issue folder names.
 */
export function listIssues(issuesDir) {
  if (!fs.existsSync(issuesDir)) {
    return [];
  }
  return fs
    .readdirSync(issuesDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !/^[_.]/.test(entry.name) &&
        entry.name !== BUILD_FIXES,
    )
    .map((entry) => entry.name)
    .sort();
}

/**
 * @typedef {object} Patch
 * @property {string} issue - Issue folder the patch belongs to.
 * @property {string} project - nwjs repository name, e.g. "nw.js".
 * @property {string} file - Absolute path of the .patch file.
 * @property {string} target - Checkout it applies to, relative to the gclient root.
 */

/**
 * Lists the patches of every issue (`<issue>/patches/<repository>/*.patch`)
 * in the order to apply them: the build fixes (BUILD_FIXES) first, then by
 * issue, then repository as in PATCH_TARGETS, then file name
 * (`git format-patch` numbers them 0001-, 0002-...).
 *
 * @param {string} issuesDir - Directory with one folder per issue.
 * @returns {Patch[]} The patches; empty if there are none.
 */
export function listPatches(issuesDir) {
  const targets = /** @type {Record<string, string>} */ (PATCH_TARGETS);
  /** @type {Patch[]} */
  const patches = [];
  const folders = listIssues(issuesDir);
  if (fs.existsSync(path.join(issuesDir, BUILD_FIXES))) {
    folders.unshift(BUILD_FIXES);
  }
  for (const issue of folders) {
    const patchesDir = path.join(issuesDir, issue, "patches");
    if (!fs.existsSync(patchesDir)) {
      continue;
    }
    const projects = fs
      .readdirSync(patchesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    for (const project of projects) {
      if (!(project in targets)) {
        throw new Error(
          `Unknown patch folder "${issue}/patches/${project}" (expected one of: ${Object.keys(targets).join(", ")})`,
        );
      }
    }
    for (const project of Object.keys(targets)) {
      if (!projects.includes(project)) {
        continue;
      }
      const dir = path.join(patchesDir, project);
      for (const name of fs.readdirSync(dir).sort()) {
        if (name.endsWith(".patch")) {
          patches.push({
            issue,
            project,
            file: path.join(dir, name),
            target: targets[project],
          });
        }
      }
    }
  }
  return patches;
}

/**
 * @typedef {object} ReleaseAsset
 * @property {string} name - File name.
 * @property {string} browser_download_url - Download URL.
 */

/**
 * Picks the Linux x64 SDK package from a release's assets. The SDK is needed
 * because the issue tests drive NW.js through its chromedriver.
 *
 * @param {ReleaseAsset[]} assets - The release's assets.
 * @returns {ReleaseAsset} The SDK package.
 */
export function selectSdkAsset(assets) {
  const sdk = assets.find((asset) =>
    /^nwjs-sdk-v[^/]+-linux-x64\.tar\.gz$/.test(asset.name),
  );
  if (!sdk) {
    const names = assets.map((asset) => asset.name).join(", ") || "none";
    throw new Error(
      `The release needs the Linux x64 SDK package (nwjs-sdk-v*-linux-x64.tar.gz); it has: ${names}`,
    );
  }
  return sdk;
}
