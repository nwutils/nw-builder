# nw-builder

Develop, build, package and update NW.js applications for Linux, MacOS and Windows.

| Package                                | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| [nw-builder](packages/nw-builder)      | Build NW.js desktop applications for MacOS, Windows and Linux.   |
| [@nwutils/builder](packages/builder)   | Build NW.js applications for Linux, MacOS and Windows.           |
| [@nwutils/cli](packages/cli)           | Command line interface for building NW.js applications.          |
| [@nwutils/doctor](packages/doctor)     | Configure NW.js environments for Linux, MacOS and Windows.       |
| [@nwutils/getter](packages/getter)     | Get NW.js and related binaries for Linux, MacOS and Windows.     |
| [@nwutils/runner](packages/runner)     | Run NW.js and related binaries for Linux, MacOS and Windows.     |
| [@nwutils/packager](packages/packager) | Package NW.js and related binaries for Linux, MacOS and Windows. |

## Contributing

```sh
npm install
npm run lint
npm run type
npm test
```

Each command fans out across every package in `./packages`. To work against a single package, use npm's `--workspace` flag, e.g. `npm test --workspace=@nwutils/getter`.

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm Trusted Publishing with OIDC is used for releases
- A package is released when a maintainer creates a release note for a specific version
