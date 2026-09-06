# @nwutils/builder

Build NW.js applications for Linux, MacOS and Windows: assembles the app source and a cached NW.js runtime into a distributable package, and applies platform-specific metadata (Linux `.desktop` entry, Windows executable resources, MacOS `Info.plist` and helper app bundles).

Extracted from [nw-builder](../nw-builder)'s own build implementation so it can be developed, tested and versioned independently, the same way `@nwutils/getter` and `@nwutils/runner` already are. `nw-builder` depends on this package for its `build` mode; most users should keep using `nw-builder` (or `@nwutils/cli`) directly rather than this package on its own.
