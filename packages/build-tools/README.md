# @nwutils/build-tools

Builds NW.js from source with our fixes for NW.js issues, and tests them.
Private package, Linux x64 only.

## How it works

1. Each fix lives in [`issues/<issue>/`](issues): a patch and a test.
2. A maintainer runs [Build NW.js](../../.github/workflows/build-nwjs.yml). It
   builds NW.js with every merged patch, publishes it as the `build-tools`
   release, and runs every test against it.
3. Fixes that work are sent upstream to NW.js.

## Fix an issue

```text
issues/<issue>/
  patches/chromium.src/0001-*.patch   the fix (or nw.js, node, v8)
  app/                                an app that shows the issue
  issue.test.js                       fails without the fix, passes with it
```

### 1. Find the source to patch

A patch must apply to the code NW.js builds from. For NW.js 0.120.0:

```sh
curl -s https://raw.githubusercontent.com/nwjs/nw.js/nw-v0.120.0/DEPS | grep -E "^  'nw_(src|v8|node)_revision'"
```

| Repository                                                  | Revision           |
| ----------------------------------------------------------- | ------------------ |
| [`nwjs/nw.js`](https://github.com/nwjs/nw.js)               | tag `nw-v0.120.0`  |
| [`nwjs/chromium.src`](https://github.com/nwjs/chromium.src) | `nw_src_revision`  |
| [`nwjs/v8`](https://github.com/nwjs/v8)                     | `nw_v8_revision`   |
| [`nwjs/node`](https://github.com/nwjs/node)                 | `nw_node_revision` |

### 2. Make the patch

Chromium is huge, so clone only the folders you change:

```sh
git init chromium.src && cd chromium.src
git remote add origin https://github.com/nwjs/chromium.src
git sparse-checkout set --no-cone /content/browser/web_contents/
git fetch --depth=1 --filter=blob:none origin <nw_src_revision>
git checkout FETCH_HEAD
```

Make your change, then commit and export it:

```sh
git commit -am "Fix <what>" -m "<why>" -m "Refs: nwjs/nw.js#<issue>"
git format-patch -1 --zero-commit -o <nw-builder>/packages/build-tools/issues/<issue>/patches/chromium.src
```

Use `Refs:`, not `Fixes:`, so the NW.js issue isn't closed by accident.

### 3. Write the test

Copy [`issues/_template`](issues/_template) to `issues/<issue>/`. Make `app/`
show the issue, and make `issue.test.js` check the fixed behaviour. Start the
app with `launch()` from [`src/testing.js`](src/testing.js).

- WebDriver can't click a file `<input>`: click a `<label>` for it.
- File dialogs need `launch(app, { headless: false, env })` and
  `fileChooserPortal()`. See [`issues/8393`](issues/8393).

Check that it fails on official NW.js (add `xvfb-run -a` without a display):

```sh
curl -sL https://dl.nwjs.io/v0.120.0/nwjs-sdk-v0.120.0-linux-x64.tar.gz | tar xz -C /tmp
node packages/build-tools/src/cli.js test --dir /tmp/nwjs-test --issue <issue> --nwdir /tmp/nwjs-sdk-v0.120.0-linux-x64
```

### 4. Open a pull request

```sh
node packages/build-tools/src/cli.js check
npm test --workspace=@nwutils/build-tools
```

Title: `chore(test): nwjs/nw.js#<issue> <what it fixes>`. Description:
`Refs: nwjs/nw.js#<issue>`.

### 5. Send it upstream

Once it works, run `/upstream-patch` in Claude Code
([skill](../../.claude/skills/upstream-patch/SKILL.md)). It opens a pull
request on NW.js from your fork. nwjs/chromium.src closes all pull requests,
so for Chromium patches it posts on the NW.js issue instead.

### Build fixes

Fixes for NW.js's own build go in [`issues/build/`](issues/build): patches
only, no test.

## Commands

```sh
node packages/build-tools/src/cli.js <command> --dir /mnt/nwjs
```

| Command  | Does                                                                    |
| -------- | ----------------------------------------------------------------------- |
| `setup`  | Downloads the source for `--version` and applies the patches.           |
| `gen`    | Prepares the build (`--flavor normal` or `sdk`).                        |
| `build`  | Compiles NW.js. `--stop-at <unix time>` stops early; rerun to continue. |
| `status` | Shows how many build steps are left.                                    |
| `dist`   | Packages the build into `out/nw/dist`.                                  |
| `test`   | Runs the issue tests against the latest release, or `--nwdir`.          |
| `check`  | Checks the issue folders, as CI does.                                   |

Needs about 100 GB of disk, Python 3 and git.

## CI

[Build NW.js](../../.github/workflows/build-nwjs.yml) is run by hand. A full
build takes longer than GitHub's 6-hour job limit, so it runs in up to 6
stages. Compiled files are cached (with
[sccache](https://github.com/mozilla/sccache)), so each stage carries on from
the last. The finished build replaces the `build-tools` release, then
[Test NW.js](../../.github/workflows/test-nwjs.yml) runs the issue tests
against it. You can also run Test NW.js on its own.
