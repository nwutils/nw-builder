# Changelog 4.x

All notable changes to this project will be documented in this file and in the [Releases](https://github.com/nwjs-community/nw-builder/blob/develop/releases) section.x

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [4.1.0-beta.0] - 2023-02-25

## Added

- MacOS ARM support

## [4.1.0] - 2023-02-23

## Added

- Use (community) prebuilt version of `ffmpeg` if the `ffmpeg` flag is `true` (defaults to `false`).

## Changed

- `await` platform specific config steps

## [4.0.11] - 2023-02-5

## Changed

- Security update `http-cache-semantics` to `v4.1.1`.

## [4.0.10] - 2023-02-05

### Added

- `options.cli` flag to prevent `node-glob` from globbing already globbed files and erroring out with a `package.json not found in srcDir file glob patterns` message.

### Changed

- Copy subdirectories of `options.srDir` in the correct location.

## [4.0.9] - 2023-02-03

### Added

- Run and build demo app in CI.

### Changed

- Fixed false positives in CI
- Throw errors instead of returning them
- Reject error object instead of exit code

## [4.0.8] - 2023-01-15

### Added

- Flag to check if specific `nw` release is cached. [#772](https://github.com/nwutils/nw-builder/pull/772)

### Changed

- Create `cacheDir`, `outDir` before getting release info. [#772](https://github.com/nwutils/nw-builder/pull/772)

## [4.0.7] - 2023-01-14

### Changed

- Do not throw error if `nwbuild` is of `object` type. [#769](https://github.com/nwutils/nw-builder/pull/769)

- Fix `package.json` path for `updateNotifier`. [#767](https://github.com/nwutils/nw-builder/pull/767)

## [4.0.6] - 2023-01-09

### Added

- Warn about loss of permissions if building Linux or MacOS on Windows. [8793d4b](https://github.com/nwutils/nw-builder/commit/8793d4bf06288199fcaff340fda43c1e2fbcacbc)

### Changed

- Fix error when `options.version` is `latest`. [33ef184](https://github.com/nwutils/nw-builder/commit/33ef184467f78fed94541e876da042b4ed99d443)

### Removed

- CJS support [968f798](https://github.com/nwutils/nw-builder/commit/968f7980de59fea72ddac8e1d64628e561de1f9a)

## [4.0.5] - 2023-01-06

### Changed

- Prevent duplicate globbing of `srcDir` files. [07901c9](https://github.com/nwutils/nw-builder/commit/07901c9e3930481ead0977b9be731765df28c087)

## [4.0.4] - 2023-01-06

### Changed

- Convert `srcDir` type from `string[]` to `string`. [1a699af](https://github.com/nwutils/nw-builder/commit/1a699af300782e0847333bb7ad945dbde8940350)

## [4.0.3] - 2023-01-06

### Added

- File globing. [#749](https://github.com/nwutils/nw-builder/pull/749)

- Linux and Windows configuration options. [#729](https://github.com/nwutils/nw-builder/pull/729)

### Changed

- Skip modification of Windows executable if platform is not Windows or Wine is not installed. [#739](https://github.com/nwutils/nw-builder/pull/739)

- Run mode should only require `srcDir`, `version` and `flavor`. [#718](https://github.com/nwutils/nw-builder/pull/718)

## [4.0.2] - 2022-11-30

### Added

- Allow user to rename NW executable. [#712](https://github.com/nwutils/nw-builder/pull/712)

### Changed

- Fix MacOS build. [#717](https://github.com/nwutils/nw-builder/pull/717)

- CJS support via `esbuild`. [#713](https://github.com/nwutils/nw-builder/pull/713)

## [4.0.1] - 2022-11-20

### Added

- Support for Desktop Entry file. [#690](https://github.com/nwutils/nw-builder/pull/690)

### Changed

- Resolve promise in `close` event with respect to compression. [#698](https://github.com/nwutils/nw-builder/pull/698)

- Check for release info after downloading NW binaries in `cacheDir`. [#697](https://github.com/nwutils/nw-builder/pull/697)

## [4.0.0] - 2022-11-16

### Added

- Rename Helper apps. [#687](https://github.com/nwutils/nw-builder/pull/687)

- MacOS support. [#685](https://github.com/nwutils/nw-builder/pull/685)

- Check for `nwbuild` object in `package.json`. [#684](https://github.com/nwutils/nw-builder/pull/684)
