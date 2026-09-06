# @nwutils/builder

[![npm](https://img.shields.io/npm/v/@nwutils/builder/latest)](https://www.npmjs.com/package/@nwutils/builder/v/latest)

Build NW.js applications for Linux, MacOS and Windows.

## Getting Started

1. `npm i` to install third party dependencies

## Usage

```js
import build from "@nwutils/builder";

await build({
  version: "0.115.0",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  srcDir: "./src",
  cacheDir: "./cache",
  outDir: "./out",
  app: {
    name: "Demo",
  },
  glob: true,
  managedManifest: false,
  zip: false,
  // The release info is from https://nwjs.io/versions.json
  releaseInfo: {
    ...,
    components: {
      "node": "26.7.0",
      "chromium": "152.0.7977.42"
    },
  },
});
```

## API Reference

Options

| Name            | Type                                      | Description                                                                                               |
| --------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| version         | `string \| "latest" \| "stable" \| "lts"` | Runtime version                                                                                           |
| flavor          | `"normal" \| "sdk"`                       | Build flavor                                                                                              |
| platform        | `"linux" \| "osx" \| "win"`               | Target platform                                                                                           |
| arch            | `"ia32" \| "x64" \| "arm64"`              | Target architecture                                                                                       |
| srcDir          | `string`                                  | Source directory                                                                                          |
| cacheDir        | `string`                                  | Directory the target NW.js runtime is cached in (populated ahead of time by `@nwutils/getter`)            |
| outDir          | `string`                                  | Directory to write the built application to                                                               |
| app             | `object`                                  | Platform specific app metadata - see the `nw-builder` docs for the full shape per platform                |
| glob            | `boolean`                                 | If true, `srcDir` is resolved via file globbing rather than copied as-is                                  |
| managedManifest | `boolean \| string \| object`             | Managed manifest mode                                                                                     |
| zip             | `false \| "zip" \| "tar" \| "tgz"`        | Compress the built application                                                                            |
| releaseInfo     | `object`                                  | Version specific release metadata for the target runtime, e.g. `releaseInfo.components.chromium` on MacOS |

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm Trusted Publishing with OIDC is used for releases
- A package is released when a maintainer creates a release note for a specific version
