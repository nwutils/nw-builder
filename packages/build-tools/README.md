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

Each fix lives in [`issues/<issue>/`](issues), named after the NW.js issue it
fixes, and is contributed by pull request. Once merged, a maintainer runs
[`build-nwjs.yml`](../../.github/workflows/build-nwjs.yml): it builds one NW.js
binary with every merged issue's patches (so patches must not conflict),
releases it, and runs every issue's test against it.

```text
issues/<issue>/
  patches/<repository>/0001-*.patch   the fix (nw.js, chromium.src, node or v8)
  app/                                an NW.js app that reproduces the issue
  issue.test.js                       a test that passes only with the fix
```

### 1. Find the revision to patch

A patch must apply to the exact source the build uses. For NW.js
`<version>` (e.g. `0.120.0`):

| Repository                                                  | Revision                                       |
| ----------------------------------------------------------- | ---------------------------------------------- |
| [`nwjs/nw.js`](https://github.com/nwjs/nw.js)               | the tag `nw-v<version>`                        |
| [`nwjs/chromium.src`](https://github.com/nwjs/chromium.src) | `nw_src_revision` in nw.js's `DEPS` at the tag |
| [`nwjs/v8`](https://github.com/nwjs/v8)                     | `nw_v8_revision`                               |
| [`nwjs/node`](https://github.com/nwjs/node)                 | `nw_node_revision`                             |

```sh
curl -s https://raw.githubusercontent.com/nwjs/nw.js/nw-v0.120.0/DEPS | grep -E "^  'nw_(src|v8|node)_revision'"
```

### 2. Make the patch

Clone only what you need: chromium.src is huge, so check out just the
folders you change, without history.

```sh
git init chromium.src && cd chromium.src
git remote add origin https://github.com/nwjs/chromium.src
git sparse-checkout set --no-cone /content/browser/web_contents/
git fetch --depth=1 --filter=blob:none origin <nw_src_revision>
git checkout FETCH_HEAD
```

Make the change, commit it with a short message that ends with
`Refs: nwjs/nw.js#<issue>` (not `Fixes`, which would close the issue if the
patch lands upstream), and export it into the issue folder:

```sh
git commit -am "Fix <what>" -m "<why, in a line or two>" -m "Refs: nwjs/nw.js#<issue>"
git format-patch -1 --zero-commit -o <nw-builder>/packages/build-tools/issues/<issue>/patches/chromium.src
git checkout HEAD~1 && git apply --check <nw-builder>/packages/build-tools/issues/<issue>/patches/chromium.src/*.patch
```

Patches made this way apply unchanged upstream. `setup` applies them with
`git apply`, after NW's own patches.

### 3. Write the test

Copy [`issues/_template`](issues/_template) to `issues/<issue>/`. Reproduce
the issue in `app/`, and assert the fixed behaviour in `issue.test.js`, run
with Node's test runner. The test must fail on the official NW.js release and
pass with the patch.

- Start the app with `launch(app, { args, headless, env })` from
  [`src/testing.js`](src/testing.js). It follows the
  [Selenium Builder example](https://github.com/nwutils/nw-testing-javascript-selenium-builder-example):
  `nwapp=<app>`, with the SDK's `nw` and its chromedriver. NW.js runs
  headless in CI unless `headless: false`.
- WebDriver can't click a file `<input>`; click a `<label>` for it instead.
- File dialogs: headless NW.js cancels them, so launch with `headless: false`
  and answer them with `fileChooserPortal(paths)`, a stand-in for the desktop
  portal Chromium shows Linux file dialogs through. It needs
  `dbus-run-session` and Python with PyGObject (`PYTHON`, default `python3`).
  See [`issues/8393`](issues/8393).

Run it against the official SDK to see it fail (on a machine without a
display, prefix the command with `xvfb-run -a`):

```sh
curl -sL https://dl.nwjs.io/v0.120.0/nwjs-sdk-v0.120.0-linux-x64.tar.gz | tar xz -C /tmp
node packages/build-tools/src/cli.js test --dir /tmp/nwjs-test --issue <issue> --nwdir /tmp/nwjs-sdk-v0.120.0-linux-x64
```

Without `--nwdir`, `test` downloads the SDK from the latest `build-tools`
release, which has every merged patch.

### 4. Check and open a pull request

```sh
node packages/build-tools/src/cli.js check
npm test --workspace=@nwutils/build-tools
```

CI runs `check` too. Title the pull request
`chore(test): nwjs/nw.js#<issue> <what it fixes>` and put
`Refs: nwjs/nw.js#<issue>` in the description.

### 5. Send it upstream

Once merged, send the patch to NW.js with the `/upstream-patch` skill in
Claude Code ([`.claude/skills/upstream-patch`](../../.claude/skills/upstream-patch/SKILL.md)),
or by hand: apply it to your fork of the repository with `git am`, then open a
pull request against `main` with `Refs: nwjs/nw.js#<issue>`. nwjs/chromium.src
closes every pull request, so for chromium.src patches, post the patch on the
NW.js issue instead.

### Build fixes

Fixes to NW.js's own build that no NW.js issue covers, such as a missing
build dependency, go in [`issues/build/patches/<repository>/`](issues/build):
patches only, made as in step 2, no test. `setup` applies them before the
issues' patches.

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
