# nwutils

Monorepo for [nw-builder](https://github.com/nwutils/nw-builder) and the NW.js tooling packages it depends on. Managed as npm workspaces; each package is released and published independently via [release-please](https://github.com/googleapis/release-please).

| Package                            | Description                                                    |
| ---------------------------------- | -------------------------------------------------------------- |
| [nw-builder](packages/nw-builder)  | Build NW.js desktop applications for MacOS, Windows and Linux. |
| [@nwutils/cli](packages/cli)       | Command line interface for building NW.js applications.        |
| [@nwutils/doctor](packages/doctor) | Configure NW.js environments for Linux, MacOS and Windows.     |
| [@nwutils/getter](packages/getter) | Get NW.js and related binaries for Linux, MacOS and Windows.   |
| [@nwutils/runner](packages/runner) | Run NW.js and related binaries for Linux, MacOS and Windows.   |

## Development

```sh
npm install
npm run lint
npm run type
npm test
```

Each command fans out across every package in `./packages`. To work against a single package, use npm's `--workspace` flag, e.g. `npm test --workspace=@nwutils/getter`.
