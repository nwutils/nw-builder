# Contributing Guide

Thank you for considering to contribute!

## Prerequisites

Install a [Node Version Manager](https://nodejs.org/en/download/package-manager).

Install Node. Consult the [version manifest](https://nwjs.io/versions) before installing. `nw-builder` matches the Node version included in NW.js's latest release. For example, if 0.74.0 is the latest version, the Node version is 19.7.0.

[Fork](https://github.com/nwutils/nw-builder/fork) the repo.

Clone the fork.

Created a new branch. If you are addressing a specific issue (for example #54), then name the branch `dev-54`. If you encounter a problem which has not been documented (search all closed issues), either open an new issue or create a branch such as `fix/glob-nested-dirs`.

## General Tips

Add inline code comments if the change you make may not be obvious to others. Add tests that cover the behavioru change. We use Node's test runner and Jest (slowly migrating away from it) for unit tests and Chromedriver for e2e tests.

Our test coverage is not great. Do not assume the package works even if all tests pass. If you're uncertain about any of the above, make the pull request anyway. A maintainer/community member will help you.
