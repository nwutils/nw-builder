# nw-cli

[![npm](https://img.shields.io/npm/v/@nwutils/cli/latest)](https://www.npmjs.com/package/@nwutils/cli/v/latest)

Command line interface for NW.js applications.

## Getting Started

1. Install package: `npm i -g @nwutils/cli`
1. Create a new project: `nw-cli create MyApp`

## CLI

### create

Create a Vanilla JavaScript project.

```shell
└─$ nw-cli create --help
Usage: nw-cli create [options] <name>

Arguments:
  name                   app name

Options:
  --template <template>  template name (default: "vanilla-js")
  --outDir <dir>         output directory (default: ".")
  -h, --help             display help for command
```

### dev

Run application in development mode.

```shell
└─$ nw-cli dev --help
Usage: nw-cli dev [options]

Run app in development mode

Options:
  --version <version>      NW.js version (default: "latest")
  --flavor <flavor>        NW.js flavor (default: "normal")
  --platform <platform>    NW.js platform (default: "linux")
  --arch <arch>            NW.js architecture (default: "x64")
  --downloadUrl <string>   Download URL (default: "https://dl.nwjs.io")
  --manifestUrl <string>   Manifest URL (default: "https://nwjs.io/versions.json")
  --cacheDir <dir>         Cache directory (default: "/home/user/.nw-cli/cache")
  --cache <boolean>        Cache binaries (default: true)
  --ffmpeg <boolean>       Download community ffmpeg (default: false)
  --nativeAddon <boolean>  Download NW.js Node headers (default: false)
  --shaSum <boolean>       Verify SHASUM (default: true)
  --srcDir <dir>           Project source directory (default: ".")
  --argv <item...>         Command line arguments (default: [])
  -h, --help               display help for command
```

> Note: If you find a template is missing, feel free to open an issue or pull request.

## API

Apply NW.js specific polyfills to your NW.js application.

```js
import { pollyfill } from '@nwutils/cli';

// Run this as early in your application lifecycle as possible.
pollyfill();
```

## Roadmap

* [ ] Add react-js template
* [ ] Package custom node test coverage action.

## Contributing

### External contributor

- Use Node.js standard libraries whenever possible.
- Prefer to use syncronous APIs over modern APIs which have been introduced in later versions.

### Maintainer

- npm trusted publishing is used for releases
- a package is released when a maintainer creates a release note for a specific version
