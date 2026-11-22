# @nwutils/upstream-diff

Understand how NW.js changes upstream behaviour.

## Versions

- NW: 0.120.0
- Chromium: 157.0.8103.39
- Node: 26.12.1
- V8: 15.7.112.23

## Patching process

[`scripts/patch`](scripts/patch) clones NW.js's forks of [Chromium](https://github.com/nwjs/chromium.src), [Node.js](https://github.com/nwjs/node) and [V8](https://github.com/nwjs/v8) (at the `nw-v<version>` tag if there is one, otherwise `main`), downloads the matching upstream release sources, and writes the difference to `patches/<project>.patch` with `git diff --no-index`. Files added by NW.js are included in full and files it removes are listed without their contents. The script fails without writing patches if either tree's version does not match the pinned version, for example when NW.js's `main` has already moved past or not yet reached a release.

The [`upstream-diff-release`](../../.github/workflows/upstream-diff-release.yml) workflow runs daily at 00:00 UTC and manually via `workflow_dispatch`. It:

1. Checks https://nwjs.io/versions.json for a new NW.js release and reads its Chromium and Node.js versions.
1. Reads the V8 version from https://github.com/nwjs/v8/blob/main/include/v8-version.h.
1. If the versions in `scripts/patch` are not the latest, updates them and the `Versions` header above (see [`scripts/bump`](scripts/bump)), regenerates the patches, and opens a pull request on the `upstream-diff/nw-<version>` branch.

The [`ci-upstream-diff`](../../.github/workflows/ci-upstream-diff.yml) workflow runs on every pull request to `main` that changes this package. It regenerates the patches from the versions in `scripts/patch` and commits them to the pull request branch if they changed. Pull requests opened by the release workflow do not trigger it, so that workflow generates the patches itself.

These patches are for reading. They're not applied anywhere; the fixes [@nwutils/build-tools](../build-tools) applies on top of NW.js live in its `issues/` folder.
