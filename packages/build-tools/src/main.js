import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  argsGn,
  assertSupported,
  capture,
  depsVar,
  exists,
  gclientFile,
  gypDefines,
  listIssues,
  listPatches,
  packageTargets,
  parseVersion,
  run,
  selectSdkAsset,
  stepsLeft,
} from "./util.js";

/**
 * @typedef {import("./util.js").Flavor} Flavor
 * @typedef {import("./util.js").Arch} Arch
 *
 * @typedef {object} Options
 * @property {string} dir - Work directory; the gclient root (holds `src/` and `depot_tools/`).
 * @property {string} [version] - NW.js version, e.g. "0.120.0" or "latest".
 * @property {Arch} [arch] - Target CPU. Defaults to "x64".
 * @property {Flavor} [flavor] - "normal" or "sdk". Defaults to "normal".
 * @property {string} [ccWrapper] - Compiler cache wrapper, e.g. "sccache".
 * @property {boolean} [installDeps] - Install Chromium's system build dependencies (uses sudo).
 * @property {number} [stopAt] - Unix time in milliseconds at which to stop building.
 * @property {string} [issues] - Issue folders (patches and tests); defaults to this package's issues/.
 * @property {string} [issue] - test: the issue whose test to run; defaults to every issue.
 * @property {string} [repo] - test: GitHub repository with the release, "owner/name".
 * @property {string} [release] - test: release tag to download.
 * @property {string} [nwdir] - test: an extracted SDK build to test instead of downloading one.
 */

const DEPOT_TOOLS =
  "https://chromium.googlesource.com/chromium/tools/depot_tools.git";
const NW_REPO = "https://github.com/nwjs/nw.js";
const VERSIONS = "https://nwjs.io/versions.json";

/** This package's issue folders: each holds patches and a test for one fix. */
export const DEFAULT_ISSUES = fileURLToPath(
  new URL("../issues", import.meta.url),
);

/** The release `test` downloads by default; each build replaces it. */
export const RELEASE_TAG = "build-tools";

/**
 * Resolves "latest" (or an empty version) to the newest NW.js release.
 *
 * @param {string | undefined} version - A version, "latest" or undefined.
 * @returns {Promise<string>} A version such as "0.120.0".
 */
export async function resolveVersion(version) {
  if (version && version !== "latest") {
    return parseVersion(version);
  }
  const response = await fetch(VERSIONS);
  if (!response.ok) {
    throw new Error(`Fetching ${VERSIONS} failed: HTTP ${response.status}`);
  }
  const { latest } = /** @type {{ latest: string }} */ (await response.json());
  return parseVersion(latest);
}

/**
 * Environment with depot_tools first on PATH, as Chromium's build docs set
 * up. depot_tools updates and bootstraps itself (including the Python its
 * gn and ninja wrappers use) the first time gclient runs.
 *
 * @param {string} dir - Work directory.
 * @returns {NodeJS.ProcessEnv} Environment for depot_tools commands.
 */
function toolsEnv(dir) {
  return {
    ...process.env,
    PATH: `${path.join(dir, "depot_tools")}${path.delimiter}${process.env.PATH}`,
    DEPOT_TOOLS_METRICS: "0",
  };
}

/**
 * Gets the sources: depot_tools, NW.js at the release tag in src/content/nw,
 * and Chromium with every dependency (NW's V8 and Node.js included) via
 * gclient, without git history, then applies every issue's patches. Re-running
 * it resets and updates an existing checkout, so the patches apply cleanly
 * again.
 *
 * @param {Options} options
 * @returns {Promise<string>} The NW.js version checked out.
 */
export async function setup({
  dir,
  version,
  installDeps = false,
  issues = DEFAULT_ISSUES,
}) {
  assertSupported(process.platform, "x64");
  const nwVersion = await resolveVersion(version);
  const tag = `nw-v${nwVersion}`;
  const env = toolsEnv(dir);
  fs.mkdirSync(dir, { recursive: true });

  if (!exists(path.join(dir, "depot_tools"))) {
    // As in Chromium's docs: a full clone, which it keeps updated itself.
    await run("git", ["clone", DEPOT_TOOLS, "depot_tools"], {
      cwd: dir,
      env,
    });
  }

  const nwDir = path.join(dir, "src", "content", "nw");
  if (!exists(nwDir)) {
    fs.mkdirSync(path.dirname(nwDir), { recursive: true });
    await run(
      "git",
      ["clone", "--depth=1", "--branch", tag, "--", NW_REPO, nwDir],
      {
        cwd: dir,
        env,
      },
    );
  } else {
    await run(
      "git",
      [
        "fetch",
        "--depth=1",
        "--",
        "origin",
        `refs/tags/${tag}:refs/tags/${tag}`,
      ],
      {
        cwd: nwDir,
        env,
      },
    );
    await run("git", ["checkout", "--force", `refs/tags/${tag}`, "--"], {
      cwd: nwDir,
      env,
    });
  }

  const deps = fs.readFileSync(path.join(nwDir, "DEPS"), "utf8");
  const revision = depsVar(deps, "nw_src_revision");
  if (!revision) {
    throw new Error(`nw_src_revision not found in ${path.join(nwDir, "DEPS")}`);
  }

  // gclient reads its configuration from .gclient in the root; `runhooks`
  // below needs it, so it's written rather than passed with --spec.
  fs.writeFileSync(path.join(dir, ".gclient"), gclientFile(revision));

  // Sync without hooks first: on a fresh Linux machine the hooks need the
  // system packages that install-build-deps.sh installs from the checkout.
  await run(
    "gclient",
    ["sync", "--no-history", "--nohooks", "--force", "--reset", "--jobs=8"],
    { cwd: dir, env },
  );
  if (installDeps) {
    await run(
      "sudo",
      [
        path.join(dir, "src", "build", "install-build-deps.sh"),
        "--no-prompt",
        "--no-chromeos-fonts",
      ],
      {
        cwd: dir,
        env,
      },
    );
  }
  await run("gclient", ["runhooks"], { cwd: dir, env });
  applyPatches(dir, issues);
  return nwVersion;
}

/**
 * Applies every issue's patches to the checkouts gclient created, after NW's
 * own patches (applied by its nw_patch hook). Each patch is applied with
 * `git apply` in its repository, so it must be made from a clone of that nwjs
 * repository at the same version, as `git format-patch` writes it.
 *
 * @param {string} dir - The gclient root.
 * @param {string} issuesDir - Directory with one folder per issue.
 * @returns {void}
 */
export function applyPatches(dir, issuesDir) {
  const patches = listPatches(issuesDir);
  for (const patch of patches) {
    const target = path.join(dir, patch.target);
    const name = `${patch.issue}/patches/${patch.project}/${path.basename(patch.file)}`;
    console.log(`Applying ${name}`);
    try {
      capture("git", ["apply", "--verbose", patch.file], {
        cwd: target,
        env: process.env,
      });
    } catch (error) {
      throw new Error(
        `${name} does not apply to ${patch.target}; update it for this version.\n${error instanceof Error ? error.message : error}`,
        { cause: error },
      );
    }
  }
  console.log(
    patches.length === 0
      ? `No patches in ${issuesDir}`
      : `Applied ${patches.length} patch(es) from ${issuesDir}`,
  );
}

/**
 * Generates the build files: GN for Chromium/NW.js in out/nw, and GYP for
 * NW's Node.js in out/Release.
 *
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function gen({ dir, arch = "x64", flavor = "normal", ccWrapper }) {
  assertSupported(process.platform, arch);
  const src = path.join(dir, "src");
  const env = toolsEnv(dir);

  fs.mkdirSync(path.join(src, "out", "nw"), { recursive: true });
  fs.writeFileSync(
    path.join(src, "out", "nw", "args.gn"),
    argsGn({ arch, flavor, ccWrapper }),
  );
  await run("gn", ["gen", "out/nw"], { cwd: src, env });

  await run(
    "python3",
    [
      "third_party/node-nw/tools/gyp/gyp_main.py",
      "-I",
      "third_party/node-nw/common.gypi",
      "-D",
      `build_type=Release_${arch}`,
      "third_party/node-nw/node.gyp",
    ],
    {
      cwd: src,
      env: {
        ...env,
        GYP_DEFINES: gypDefines({ arch, flavor }),
        GYP_GENERATORS: "ninja",
        GYP_CHROMIUM_NO_ACTION: "0",
        GYP_GENERATOR_FLAGS: "output_dir=out",
      },
    },
  );
}

/**
 * Builds NW.js: Chromium and everything NW packages (out/nw), then Node.js
 * (out/Release), which links against V8, libc++ and other libraries from the
 * Chromium build, then copies libnode into out/nw/lib. Ninja only redoes what
 * is out of date, so a build stopped at `stopAt` continues where it left off
 * when run again (and with a compiler cache, recompiling a fresh checkout is
 * mostly cache hits).
 *
 * @param {Options} options
 * @returns {Promise<boolean>} True when the build finished, false if it stopped at `stopAt`.
 */
export async function build({ dir, flavor = "normal", stopAt }) {
  const src = path.join(dir, "src");
  const env = toolsEnv(dir);
  const steps = [
    ["-C", "out/nw", ...packageTargets(flavor)],
    ["-C", "out/Release", "node"],
    ["-C", "out/nw", "copy_node"],
  ];
  for (const step of steps) {
    if ((await run("ninja", step, { cwd: src, env, stopAt })) === "stopped") {
      return false;
    }
  }
  return true;
}

/**
 * Counts the Chromium build steps left (out/nw) for the files NW.js packages.
 *
 * @param {Options} options
 * @returns {number} Steps left; 0 when that part of the build is done.
 */
export function status({ dir, flavor = "normal" }) {
  const src = path.join(dir, "src");
  const output = capture(
    "ninja",
    ["-n", "-C", "out/nw", ...packageTargets(flavor)],
    { cwd: src, env: toolsEnv(dir) },
  );
  return stepsLeft(output);
}

/**
 * Packages the built binaries with NW's own packaging script, as its `dist`
 * target does but without that target's symbol dumping (which would also
 * build chromedriver and the breakpad tools for the normal flavor).
 *
 * @param {Options} options
 * @returns {Promise<string[]>} Paths of the packages created, in out/nw/dist.
 */
export async function dist({ dir, arch = "x64", flavor = "normal" }) {
  const src = path.join(dir, "src");
  await run(
    "python3",
    [
      "content/nw/tools/package_binaries.py",
      "--path",
      "out/nw",
      "--arch",
      arch,
      "--mode",
      flavor === "sdk" ? "sdk" : "nosdk",
      "--icudat",
      "third_party/icu/common/icudtl.dat",
      "--step",
      "nw",
    ],
    { cwd: src, env: toolsEnv(dir) },
  );
  const distDir = path.join(src, "out", "nw", "dist");
  return fs.readdirSync(distDir).map((file) => path.join(distDir, file));
}

/**
 * Runs the issues' tests (`issues/<issue>/*.test.js`, with Node's test
 * runner) against an SDK build: every issue's, since a build carries every
 * issue's patches, or just `issue`'s. By default the build is the Linux x64
 * SDK from the latest `build-tools` release, downloaded and extracted into
 * `dir`. The test finds
 * the build through NWJS_SDK_DIR (see src/testing.js). Needs a display, e.g.
 * xvfb-run, unless the test runs NW headless.
 *
 * @param {Options} options
 * @returns {Promise<boolean>} True when the tests passed (or there are none).
 */
export async function test({
  dir,
  issues = DEFAULT_ISSUES,
  issue,
  repo = process.env.GITHUB_REPOSITORY ?? "nwutils/nw-builder",
  release = RELEASE_TAG,
  nwdir,
}) {
  if (issue !== undefined && !/^[\w-][\w.-]*$/.test(issue)) {
    throw new Error(`Invalid issue name: ${JSON.stringify(issue)}`);
  }
  const selected = issue ? [issue] : listIssues(issues);
  if (selected.length === 0) {
    console.log(`No issues to test in ${issues}`);
    return true;
  }
  const files = selected.flatMap((name) => {
    const issueDir = path.join(issues, name);
    if (!exists(issueDir)) {
      throw new Error(`No issue folder ${issueDir}`);
    }
    const tests = fs
      .readdirSync(issueDir)
      .filter((file) => file.endsWith(".test.js"))
      .map((file) => path.join(issueDir, file));
    if (tests.length === 0) {
      throw new Error(`Issue ${name} has no *.test.js in ${issueDir}`);
    }
    return tests;
  });

  fs.mkdirSync(dir, { recursive: true });
  const sdk = nwdir ?? (await downloadSdk({ dir, repo, release }));
  try {
    // A fresh test run even when called from inside one, which Node's test
    // runner would otherwise skip as a nested run.
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    await run(process.execPath, ["--test", ...files], {
      cwd: dir,
      env: { ...env, NWJS_SDK_DIR: path.resolve(sdk) },
    });
    return true;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Downloads a release's Linux x64 SDK package into `dir` and extracts it.
 *
 * @param {{ dir: string, repo: string, release: string }} options
 * @returns {Promise<string>} Directory with the extracted SDK.
 */
async function downloadSdk({ dir, repo, release }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error(`Invalid repository: ${JSON.stringify(repo)}`);
  }
  /** @type {Record<string, string>} */
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const url = `https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(release)}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Fetching ${url} failed: HTTP ${response.status}`);
  }
  const { assets } =
    /** @type {{ assets: import("./util.js").ReleaseAsset[] }} */ (
      await response.json()
    );
  const sdk = selectSdkAsset(assets);
  console.log(`Downloading ${sdk.name}`);
  const download = await fetch(sdk.browser_download_url);
  if (!download.ok) {
    throw new Error(`Downloading ${sdk.name} failed: HTTP ${download.status}`);
  }
  const file = path.join(dir, sdk.name);
  fs.writeFileSync(file, Buffer.from(await download.arrayBuffer()));
  await run("tar", ["-xzf", file], { cwd: dir, env: process.env });
  return path.join(dir, sdk.name.replace(/\.tar\.gz$/, ""));
}

/**
 * Checks that every issue folder is complete, as a contribution must be: a
 * valid name, a test (`*.test.js`), and patches only in nwjs repository
 * folders, each a `git format-patch`/`git diff` patch. Whether the patches
 * apply is checked by the build, which needs the full checkout.
 *
 * @param {Options} options
 * @returns {string[]} Problems found; empty when every issue is complete.
 */
export function check({ issues = DEFAULT_ISSUES }) {
  /** @type {string[]} */
  const problems = [];
  for (const name of listIssues(issues)) {
    const issueDir = path.join(issues, name);
    if (!/^[\w-][\w.-]*$/.test(name)) {
      problems.push(
        `${name}: issue folder names may only use letters, digits, ".", "-" and "_"`,
      );
    }
    if (!fs.readdirSync(issueDir).some((file) => file.endsWith(".test.js"))) {
      problems.push(`${name}: has no *.test.js testing the fix`);
    }
  }
  try {
    const patches = listPatches(issues);
    for (const patch of patches) {
      const text = fs.readFileSync(patch.file, "utf8");
      if (!/^diff --git /m.test(text)) {
        problems.push(
          `${path.relative(issues, patch.file)}: not a git patch (make it with git format-patch)`,
        );
      }
    }
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }
  return problems;
}
