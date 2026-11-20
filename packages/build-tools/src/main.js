import fs from "node:fs";
import path from "node:path";

import {
  argsGn,
  assertSupported,
  capture,
  depsVar,
  exists,
  gclientSpec,
  gypDefines,
  run,
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
 */

const DEPOT_TOOLS =
  "https://chromium.googlesource.com/chromium/tools/depot_tools.git";
const NW_REPO = "https://github.com/nwjs/nw.js";
const VERSIONS = "https://nwjs.io/versions.json";

/**
 * Resolves "latest" (or an empty version) to the newest NW.js release.
 *
 * @param {string | undefined} version - A version, "latest" or undefined.
 * @returns {Promise<string>} A version such as "0.120.0".
 */
export async function resolveVersion(version) {
  if (version && version !== "latest") {
    return version.replace(/^v/, "");
  }
  const response = await fetch(VERSIONS);
  if (!response.ok) {
    throw new Error(`Fetching ${VERSIONS} failed: HTTP ${response.status}`);
  }
  const { latest } = /** @type {{ latest: string }} */ (await response.json());
  return latest.replace(/^v/, "");
}

/**
 * Environment with depot_tools first on PATH and its self-update off.
 *
 * @param {string} dir - Work directory.
 * @returns {NodeJS.ProcessEnv} Environment for depot_tools commands.
 */
function toolsEnv(dir) {
  return {
    ...process.env,
    PATH: `${path.join(dir, "depot_tools")}${path.delimiter}${process.env.PATH}`,
    DEPOT_TOOLS_UPDATE: "0",
    DEPOT_TOOLS_METRICS: "0",
  };
}

/**
 * Gets the sources: depot_tools, NW.js at the release tag in src/content/nw,
 * and Chromium with every dependency (NW's V8 and Node.js included) via
 * gclient, without git history. Re-running it updates an existing checkout.
 *
 * @param {Options} options
 * @returns {Promise<string>} The NW.js version checked out.
 */
export async function setup({ dir, version, installDeps = false }) {
  assertSupported(process.platform, "x64");
  const nwVersion = await resolveVersion(version);
  const tag = `nw-v${nwVersion}`;
  const env = toolsEnv(dir);
  fs.mkdirSync(dir, { recursive: true });

  if (!exists(path.join(dir, "depot_tools"))) {
    await run("git", ["clone", "--depth=1", DEPOT_TOOLS, "depot_tools"], {
      cwd: dir,
      env,
    });
  }

  const nwDir = path.join(dir, "src", "content", "nw");
  if (!exists(nwDir)) {
    fs.mkdirSync(path.dirname(nwDir), { recursive: true });
    await run("git", ["clone", "--depth=1", "--branch", tag, NW_REPO, nwDir], {
      cwd: dir,
      env,
    });
  } else {
    await run("git", ["fetch", "--depth=1", "origin", "tag", tag], {
      cwd: nwDir,
      env,
    });
    await run("git", ["checkout", "--force", tag], { cwd: nwDir, env });
  }

  const deps = fs.readFileSync(path.join(nwDir, "DEPS"), "utf8");
  const revision = depsVar(deps, "nw_src_revision");
  if (!revision) {
    throw new Error(`nw_src_revision not found in ${path.join(nwDir, "DEPS")}`);
  }

  // Sync without hooks first: on a fresh Linux machine the hooks need the
  // system packages that install-build-deps.sh installs from the checkout.
  await run(
    "gclient",
    [
      "sync",
      "--spec",
      gclientSpec(revision),
      "--no-history",
      "--nohooks",
      "--force",
      "--reset",
      "--jobs=8",
    ],
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
  return nwVersion;
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
 * Builds NW.js: Node.js (out/Release), then the nwjs target (out/nw), then
 * copies libnode into it. Ninja only redoes what is out of date, so a build
 * stopped at `stopAt` continues where it left off when run again (and with a
 * compiler cache, recompiling a fresh checkout is mostly cache hits).
 *
 * @param {Options} options
 * @returns {Promise<boolean>} True when the build finished, false if it stopped at `stopAt`.
 */
export async function build({ dir, stopAt }) {
  const src = path.join(dir, "src");
  const env = toolsEnv(dir);
  const steps = [
    ["-C", "out/Release", "node"],
    ["-C", "out/nw", "nwjs"],
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
 * Counts the build steps left for the nwjs target.
 *
 * @param {Options} options
 * @returns {number} Steps left; 0 when NW.js is fully built.
 */
export function status({ dir }) {
  const src = path.join(dir, "src");
  const output = capture("ninja", ["-n", "-C", "out/nw", "nwjs"], {
    cwd: src,
    env: toolsEnv(dir),
  });
  return stepsLeft(output);
}

/**
 * Packages the built binaries with NW's own `dist` target.
 *
 * @param {Options} options
 * @returns {Promise<string[]>} Paths of the packages created, in out/nw/dist.
 */
export async function dist({ dir }) {
  const src = path.join(dir, "src");
  await run("ninja", ["-C", "out/nw", "dist"], {
    cwd: src,
    env: toolsEnv(dir),
  });
  const distDir = path.join(src, "out", "nw", "dist");
  return fs.readdirSync(distDir).map((file) => path.join(distDir, file));
}
