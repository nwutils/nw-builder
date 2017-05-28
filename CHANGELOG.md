# Change Log

All notable changes to this project will be documented in this file and in the [Releases](https://github.com/nwjs-community/nw-builder/blob/develop/releases) section.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.4.0] - 2017-05-28

### Added

- If using the package programmatically and it's out of date, a message will be shown (this was always the case for the CLI).
- There is now a README in every directory (with at least a single sentence summarizing the directory) to help with onboarding contributors.

### Changed

- Some dependencies are updated.

### Removed

- `osx32` is removed from the default list of platforms. Thanks to [@preaction](https://github.compreaction) (PR [#439](https://github.com/nwjs-community/nw-builder/pull/439)).
- An unnecessary `rcedit` dependency is removed.

### Fixed

- For Node 7+ users, you won't see a `os.tmpDir` deprecation warning anymore.

---

## Old format

- 2017-05-22    `3.2.3` Fix for caching when a version is specified (thanks @piwonesien for the help).
- 2017-05-20    `3.2.2` Fix: when using the `nwbuild` in run mode, the `-p` option was ignored and the current platform was always used. 
- 2017-05-16    `3.2.1` Fix: NW.js 0.22.0+ apps didn't open.
- 2017-02-12    `3.2.0` Defaults to HTTPS now, added `manifestUrl` option, and bumped some dependencies.
- 2016-10-09    `3.1.2` Fix for passing array as files option when running app (plus some security fixes).
- 2016-10-09    `3.1.1` Fix for flavor feature when using CLI.
- 2016-09-14    `3.1.0` Ability to select any flavor of NW.js, not just `sdk`.
- 2016-08-28    `3.0.0` bumping graceful-fs-extra dependency to 2.0.0.
- 2016-08-14    `2.2.7` fix for macIcns option when using NW.js 0.12.3
- 2016-07-31    `2.2.6` fix for OS X caching
- 2016-07-03    `2.2.5` fix for update-notifier usage in bin
- 2016-07-03    `2.2.4` fix for syntax error in CLI
- 2016-07-02    `2.2.3` a few small fixes for the run option and more
- 2016-07-02    `2.2.2` fix for cache check of some legacy versions
- 2016-07-02    `2.2.1` supports newer NW.js versions (via http://nwjs.io/versions.json), plus other fixes.
- 2015-12-18    `2.2.0` added `zip` option.
- 2015-12-06    `2.1.0` added `cacheDir` command-line option, fix for no info being passed back, etc.
- 2015-06-28    `2.0.2` put upper bound to semver check for windows.
- 2015-06-14    `2.0.1` safer validation of versions.
- 2015-06-14    `2.0.0` changed to nw-builder, etc.
- 2015-05-05    `1.0.12` when using latest NW.js version, it's first validated that it's not an alpha version (fixes [#222](https://github.com/nwjs/nw-builder/issues/222)). Plus a fix for the `winIco` & `macIcns` command line options
- 2015-01-29    `1.0.8` fixed EMFILE errors (see [#147](https://github.com/nwjs/nw-builder/issues/147) [#148](https://github.com/nwjs/nw-builder/pull/148))
- 2015-01-21    `1.0.7` fixed about screen when copyright is not supplied
- 2015-01-15    `1.0.6` fixed downloads for nw.js version 0.12.0-alpha1
- 2015-01-15    `1.0.5` fixed downloads for NW.js versions < 0.12.0-alpha
- 2014-12-12    `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors.
- 2014-12-07    `0.4.0` macPlist CFBundleIdentifier is generated from `package.json` (see [#131](https://github.com/nwjs/nw-builder/pull/131))
- 2014-11-14    `0.3.0` macPlist option improvements (see [#96](https://github.com/nwjs/nw-builder/pull/96))
- 2014-10-30    `0.2.0` adds support for platform-specific manifest overrides (see [#94](https://github.com/nwjs/nw-builder/pull/94))
- 2014-08-19    `0.1.2` adds a progress bar to downloads, fixes downloading through a proxy, fixed winIco, bug fixes
- 2014-08-01    `0.1.0` use app filename for generated executables, optimized version checking, (known issue: `winIco` on windows)
- 2014-07-31    `0.0.4` fixed compatibility with nodewebkit 0.10.0
- 2014-04-20    Added run option, bug fixes
- 2014-04-13    Preview Release

