# @nwutils/build-tools

Private package: sets up the environment and compiles NW.js from source,
following NW.js's own build flow. Linux x64 only for now.

## Usage

```sh
node packages/build-tools/src/cli.js setup --dir /mnt/nwjs --version 0.120.0 --install-deps
node packages/build-tools/src/cli.js gen   --dir /mnt/nwjs --flavor normal --cc-wrapper sccache
node packages/build-tools/src/cli.js build --dir /mnt/nwjs
node packages/build-tools/src/cli.js dist  --dir /mnt/nwjs
```

| Command  | Does                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup`  | Clones depot_tools, NW.js at `nw-v<version>` into `src/content/nw`, then `gclient sync` (no git history, Chromium's "small" checkout) with NW's DEPS, which pins Chromium (`nwjs/chromium.src`), V8 (`nwjs/v8`) and Node.js (`nwjs/node`). `--install-deps` runs Chromium's `install-build-deps.sh` (sudo). |
| `gen`    | Writes `out/nw/args.gn` and runs `gn gen`; generates NW's Node.js build (GYP) in `out/Release`.                                                                                                                                                                                                             |
| `build`  | Chromium and every file NW packages (`out/nw`), then Node.js (`out/Release`, which links against the Chromium build's V8 and libc++), then `copy_node`. With `--stop-at <unix seconds>` it stops at that time and exits 3; run it again to continue.                                                        |
| `status` | Prints how many Chromium build steps are left.                                                                                                                                                                                                                                                              |
| `dist`   | Runs NW's packaging script; packages land in `out/nw/dist`. Unlike NW's `dist` target, it skips dumping debug symbols, which would also build chromedriver and the breakpad tools.                                                                                                                          |

`--flavor sdk` builds the SDK flavor (DevTools, `nwjc`, chromedriver). Builds
are release builds without debug symbols (`symbol_level = 0`) to keep CI time
and disk down, and don't fail on compiler warnings. With `--cc-wrapper`, Clang
header modules are turned off, since sccache can't cache compiles that use
them.

Needs ~100 GB of disk, Python 3 and git.

## GitHub Actions

[`build-nwjs.yml`](../../.github/workflows/build-nwjs.yml) (manual) builds a
version on `ubuntu-24.04`. A full build is longer than the 6 hour job limit,
so it runs as a chain of up to 6 stages:

- Each stage syncs the sources, then builds until 30 minutes before its limit.
- Compiled objects are cached in the GitHub Actions cache through
  [sccache](https://github.com/mozilla/sccache) (`cc_wrapper`), so the next
  stage, or the next run, gets them back as cache hits instead of recompiling.
- The stage that finishes packages the build and uploads it as an artifact;
  later stages are skipped.

The build directory itself (~60 GB) is too large to cache; the compiler cache
is what carries progress over. Each stage repeats the source sync, code
generation, Rust and linking, which sccache does not cover.

The GitHub Actions cache holds 10 GB per repository by default, evicting the
oldest entries. If a full Chromium compiler cache outgrows that, raise the
repository's cache limit, or point sccache at S3, GCS or R2 instead (see
sccache's docs).
