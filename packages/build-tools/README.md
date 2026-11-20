# @nwutils/build-tools

Private package: sets up the environment and compiles NW.js from source,
following NW.js's own build flow. Linux x64 only for now.

## Usage

```sh
node packages/build-tools/src/cli.js setup --dir /mnt/nwjs --version 0.120.0 --install-deps
node packages/build-tools/src/cli.js gen   --dir /mnt/nwjs --flavor normal --cc-wrapper sccache
node packages/build-tools/src/cli.js build --dir /mnt/nwjs
node packages/build-tools/src/cli.js dist  --dir /mnt/nwjs
node packages/build-tools/src/cli.js test  --dir /tmp/nwjs-test --issue 1234
```

| Command  | Does                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup`  | Clones depot_tools, NW.js at `nw-v<version>` into `src/content/nw`, then `gclient sync` (no git history, Chromium's "small" checkout) with NW's DEPS, which pins Chromium (`nwjs/chromium.src`), V8 (`nwjs/v8`) and Node.js (`nwjs/node`). `--install-deps` runs Chromium's `install-build-deps.sh` (sudo). |
| `gen`    | Writes `out/nw/args.gn` and runs `gn gen`; generates NW's Node.js build (GYP) in `out/Release`.                                                                                                                                                                                                             |
| `build`  | Chromium and every file NW packages (`out/nw`), then Node.js (`out/Release`, which links against the Chromium build's V8 and libc++), then `copy_node`. With `--stop-at <unix seconds>` it stops at that time and exits 3; run it again to continue.                                                        |
| `status` | Prints how many Chromium build steps are left.                                                                                                                                                                                                                                                              |
| `dist`   | Runs NW's packaging script; packages land in `out/nw/dist`. Unlike NW's `dist` target, it skips dumping debug symbols, which would also build chromedriver and the breakpad tools.                                                                                                                          |
| `test`   | Downloads the SDK from the latest `build-tools` release (or uses `--nwdir`) and runs `--issue`'s test against it.                                                                                                                                                                                           |

`--flavor sdk` builds the SDK flavor (DevTools, `nwjc`, chromedriver). Builds
are release builds without debug symbols (`symbol_level = 0`) to keep CI time
and disk down, and don't fail on compiler warnings. With `--cc-wrapper`, Clang
header modules are turned off, since sccache can't cache compiles that use
them.

Needs ~100 GB of disk, Python 3 and git.

## Issues

Each fix lives in [`issues/<issue>/`](issues), named after the NW.js issue
it fixes, and is contributed by pull request:

1. Copy [`issues/_template`](issues/_template) to `issues/<issue>/` and add
   the patch and its test (below). CI checks the folder with
   `build-tools check`.
1. Once merged to `main`, a maintainer runs
   [`build-nwjs.yml`](../../.github/workflows/build-nwjs.yml). It builds one
   NW.js binary with every merged issue's patches (so patches must not
   conflict with each other), releases it, and runs every issue's test
   against the release.

An issue folder holds:

- `patches/<repository>/*.patch`: the fix, one folder per nwjs repository
  (`nw.js`, `chromium.src`, `node`, `v8`). Make each patch in a clone of that
  repository at the build's version with `git format-patch`, so it applies
  unchanged upstream. `setup` applies every issue's patches with `git apply`,
  after NW's own patches.
- `app/`: an NW.js app that reproduces the issue.
- `*.test.js`: a test of the fixed behaviour, run with Node's test runner. It
  starts the app with `launch()` from [`src/testing.js`](src/testing.js),
  which follows the
  [Selenium Builder example](https://github.com/nwutils/nw-testing-javascript-selenium-builder-example):
  `nwapp=<app>`, the SDK's `nw` as the binary and its chromedriver through
  `ServiceBuilder`. The test needs the SDK flavor.

NW.js runs headless in CI, where it cancels file dialogs. To test a file
dialog, launch NW.js with `headless: false` (CI runs the tests on Xvfb) and
answer the dialog with `fileChooserPortal(paths)` from `src/testing.js`: a
stand-in for the desktop portal that Chromium shows Linux file dialogs
through, which picks `paths` in every dialog. It needs `dbus-run-session` and
Python with PyGObject (`PYTHON`, default `python3`); see
[`issues/8393`](issues/8393).

## GitHub Actions

[`build-nwjs.yml`](../../.github/workflows/build-nwjs.yml) (manual; inputs:
version, flavor) builds NW.js with every issue's patches on `ubuntu-24.04`,
publishes it as the `build-tools` release, then runs every issue's test
against that release with
[`test-nwjs.yml`](../../.github/workflows/test-nwjs.yml), which can also be run
on its own, for one issue or all.

- **Release:** each build deletes the previous `build-tools` release and its
  tag and publishes a new one, marked as the repository's latest release.
- **Stages:** a full build is longer than the 6 hour job limit, so it runs as
  a chain of up to 6 stages:

  - Each stage syncs the sources, then builds until 30 minutes before its limit.
  - Compiled objects are cached in the GitHub Actions cache through
    [sccache](https://github.com/mozilla/sccache) (`cc_wrapper`), so the next
    stage, or the next run, gets them back as cache hits instead of
    recompiling.
  - The stage that finishes packages the build and uploads it; later stages
    are skipped.

The build directory itself (~60 GB) is too large to cache; the compiler cache
is what carries progress over. Each stage repeats the source sync, code
generation, Rust and linking, which sccache does not cover.

The GitHub Actions cache holds 10 GB per repository by default, evicting the
oldest entries. If a full Chromium compiler cache outgrows that, raise the
repository's cache limit, or point sccache at S3, GCS or R2 instead (see
sccache's docs).
