# Build fixes

These patches fix compiler and linker errors we hit building NW.js on GitHub
Actions. They aren't tied to an NW.js issue, so they have no test, and they're
applied before the issue patches.

They may or may not need to be upstreamed.

| Patch                                                                                                       | Fixes                                                                  |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`chromium.src/0001`](patches/chromium.src/0001-Add-missing-commit_id-dependency-to-content-renderer.patch) | `nw/id/commit.h` not found: a missing build dependency.                |
| [`node/0001`](patches/node/0001-Use-the-Debian-bullseye-sysroots-on-Linux.patch)                            | `sys/types.h` not found: node pointed at sysroots NW doesn't download. |
| [`node/0002`](patches/node/0002-Link-node_js2c-with-Chromium-s-libc-on-Linux.patch)                         | Undefined `std::__1` symbols when linking `node_js2c`.                 |
