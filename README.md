# nw-builder [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/nwjs/nw-builder.svg)](https://gitter.im/nwjs/nw-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/nw-builder.png?downloads=true)](https://nodei.co/npm/nw-builder/)

> Build your [NW.js](https://github.com/nwjs/nw.js) apps for Mac, Win and Linux programmatically or via CLI.


### Installation

##### Local
```shell
npm install nw-builder --save-dev
```

##### Global
```shell
npm install nw-builder -g
```

##### Grunt and Gulp Plugins
Yes, there is also a [Grunt Plugin](https://github.com/nwjs/grunt-nw-builder). For Gulp, just use the module :)


## Usage

```shell
Usage: nwbuild [options] [path]

Options:
  -p, --platforms      Platforms to build, comma-sperated, can be: win32,win64,osx32,osx64,linux32,linux64   ['osx64', 'win32', 'win64']
  -v, --version        The nw version, eg. 0.8.4                                             [default: "latest"]
  -r, --run            Runs NW.js for the current platform                                   [default: false]
  -o, --buildDir       The build folder                                                      [default: "./build"]
  -f, --forceDownload  Force download of NW.js                                               [default: false]
  --cacheDir           The cache folder
  --quiet              Disables logging                                                      [default: false]

```
#### Run NW.js
During development you can run NW.js with `nwbuild -r path/to/your/younwapp/`

Or use the module:

```js
var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './path/to/nwfiles/**/**', // use the glob format
    platforms: ['osx64', 'win32', 'win64'],
    version: '0.14.6'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
```

`build` also supports callbacks:

```javascript
nw.build(function(err) {
    if(err) console.log(err);
})

```

### Options

#### options.files *Required*
Type: `String`  
Default value: `null`  

The path to your node webkit app. It supports [simple-glob](https://github.com/jedmao/simple-glob) so you can do stuff like `['foo/*.js', '!foo/bar.js', 'foo/bar.js']`.


#### options.version
Type: `String`
Default value: `'latest'`

The version of NW.js you want to use. Per default it looks up the latest version. [Here is a list](https://github.com/nwjs/nw.js/wiki/Downloads-of-old-versions) of all available releases

#### options.flavor
Type: `String`
Default value: `'sdk'`

The flavor of NW.js you want to use. Per default it will be `sdk`. [Here is a list](https://github.com/nwjs/nw.js/wiki/Build-Flavors) of all flavor available.

The value `sdk` is most used for development whereas `normal` for production.

#### options.platforms
Type: `Array`  
Default value: `['osx64', 'win32', 'win64']`

The platforms you want to build. Can be `['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']`

The values `['win', 'osx', 'linux']` can also be used and will build both the 32 and 64 bit versions of the specified platforms.

Be aware that the osx32 version can only be built with legacy version of nwjs. Since > 0.12.0, only 64 bits for osx works.

#### options.appName
Type: `String`  
Default value: `false`  

The Name of your NW.js app. If this value is set to null, it will autodetect the `name` from your projects package.json. This will be used to generate a plist file for mac.

#### options.appVersion
Type: `String`  
Default value: `false`  

The version of your NW.js app. If this value is set to null, it will autodetect the `version` form your projects package.json. This will be used to generate a plist file for mac.

#### options.buildDir
Type: `String`  
Default value: `./build`  

This is where the releases are saved.

#### options.cacheDir
Type: `String`  
Default value: `./cache`  

This is where the cached NW.js downloads are

#### options.buildType
Type: `String` or `function`
Default value: `default`  

How you want to save your build.

* `default` [appName]
* `versioned` [appName] -v[appVersion]
* `timestamped` [appName] - [timestamp];
* A function with options as scope (e.g `function () {return this.appVersion;}` )

#### options.forceDownload
Type: `Boolean`  
Default value: `false`  

This will delete everything in your `build_dir` directory, including the cached downloaded prebuilt binaries

#### options.macCredits
Type: `String`  
Default value: `false`  

MAC ONLY: The path to your credits.html file. If your don't provide your own it will use the one provided by NW.js

#### options.macIcns
Type: `String`  
Default value: `false`  

MAC ONLY: The path to your ICNS icon file. If your don't provide your own it will use the one provided by NW.js

#### options.zip
Type: `Boolean`
Default value: `null`

WINDOW ONLY: Instead of zipping the application and merging it into the executable the application content is placed next to the application (which speed up the startup time for large apps). The default behaviour is platform specific. For `windows` and `linux`, the application is zipped and merged into the executable. For `mac`, the application is not zipped.

#### options.zipOptions
Type: `Object`
Default value: `null`

Allows to configure the underling zip library parameters, like store or compression ratio.

See [archiver](http://archiverjs.com/docs/global.html#ZipOptions) documentation for detailed description of properties.

#### options.macPlist
Type: `String` or `Object`  
Default value: `false`  

MAC ONLY: Pass a string containing the path to your own plist file. If a string isn't passed, a plist file will be generated from your package.json. Pass an object to overwrite or add properties to the generated plist file.

#### options.winIco
Type: `String`  
Default value: `null`

WINDOWS ONLY: The path to your ICO icon file. If your don't provide your own it will use the one provided by NW.js. If you are building on MAC or LINUX you must have [Wine](https://www.winehq.org/) installed to use this option.

#### options.macZip (DEPRECATED)
Type: `Boolean`
Default value: `null`

MAC ONLY: Use a `app.nw` folder instead of `ZIP` file, this significantly improves the startup speed of applications on `mac`, since no decompressing is needed. Builds on other platforms will still use `ZIP` files. The default behaviour of node-webkit-builder is to not use `ZIP` files on the `mac` platform. In case of the `mac` platform the option `macZip` can override the option `zip`.

### Manifest Options

#### platformOverrides

Allows you to specify platform-specific manifest values. Example manifest:

```json
{
    "name": "nw-demo",
    "version": "0.1.0",
    "main": "index.html",
    "window": {
        "frame": false,
        "toolbar": false
    },
    "platformOverrides": {
        "win": {
            "window": {
                "toolbar": true
            }
        },
        "win32": {
            "window": {
                "frame": true,
                "toolbar": false
            }
        },
        "win64": {
            "window": {
                "frame": true
            }
        },
        "osx": {
            ...
        },
        "osx32": {
            ...
        },
        "osx64": {
            ...
        },
        "linux": {
            ...
        },
        "linux32": {
            ...
        },
        "linux64": {
            ...
        },
    }

```

The platform-specific options will override the others only when building that platform only and the `platformOverrides` property will be removed.

For example, when building for Windows, the manifest generated and put into the end app (from the manifest above) would be:

```json
{
    "name": "nw-demo",
    "version": "0.1.0",
    "main": "index.html",
    "window": {
        "frame": true,
        "toolbar": false
    }
}
```

Additionally, when specifying multiple version of the same platform such as "win", "win32", and "win64", changes will be applied such that "win" applies to both "win32" and "win64", while "win32" and "win64" apply only to the specified version. Also note that "win32" and "win64" can further override changes made in "win".

See [#85](https://github.com/nwjs/nw-builder/issues/85) and [#94](https://github.com/nwjs/nw-builder/pull/94) for more information. If you need this during development too, see [platform-overrides](https://github.com/adam-lynch/platform-overrides) and [gulp-platform-overrides](https://github.com/adam-lynch/gulp-platform-overrides). There is no Grunt plugin, [yet](https://github.com/new).

## Troubleshooting

### OSX ulimit

Darwin (OS X kernel) has a low limit for file descriptors (256 per process) by default, so you might get an `EMFILE` error or an error mentioning "too many open files" if youtry to open more file descriptors than this.

To get around it, run `ulimit -n 1024` (or add it to your `~/.bash_profile`). For more information, see [henvic/osx-ulimit](https://github.com/henvic/osx-ulimit).

## Team

**Current**

- Adam Lynch ([@adam-lynch](https://github.com/adam-lynch))
- Rémy Boulanouar ([@DblK](https://github.com/DblK))
- You? :smile:. We're open to contributions (to the code, documentation, or anything else) and or additional maintainers.

**Past**

- Steffen Müller ([@steffenmllr](https://github.com/steffenmllr)) (Creator)
- Gabe Paez ([@gabepaez](https://github.com/gabepaez))
- Andy Trevorah ([@trevorah](https://github.com/trevorah))

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Release History

See [CHANGELOG.md](CHANGELOG.md) or [Releases](https://github.com/nwjs-community/nw-builder/blob/develop/releases).

## License

[MIT License](https://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://www.npmjs.com/package/nw-builder
[npm-image]: https://img.shields.io/npm/v/nw-builder.svg?style=flat

[travis-url]: https://travis-ci.org/nwjs/nw-builder
[travis-image]: https://img.shields.io/travis/nwjs/nw-builder/master.svg?style=flat

[depstat-url]: https://david-dm.org/nwjs/nw-builder
[depstat-image]: https://david-dm.org/nwjs/nw-builder.svg?style=flat


