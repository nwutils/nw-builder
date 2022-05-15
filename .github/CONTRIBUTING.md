CONTRIBUTING
===

## EditorConfig

This project has a [.editorconifg](.editorconfig) file. Go to [EditorConfig.org](EditorConfig.org) and install the plugin for your editor.

## Running the tests

1. `npm install`
2. `npm test`

Note: some permission assertions always fail on Windows for now (:frowning:, I know)

## Publishing

1. Add a line to the changelog in the README.
2. Bump version in the `package.json` (see [semver.org](http://semver.org))
3. Run `node build` 
4. Run `npm publish`
5. Commit the `package.json` and README changes as `{{version}}` (i.e. `1.2.3` if you just published `1.2.3`).
6. Push.
7. Create a [release](https://github.com/nwjs/nw-builder/releases).

Think about [grunt-nw-builder](https://github.com/nwjs/grunt-nw-builder). It will need to be updated and published if this is a breaking change (i.e. a major version bump) or it requires a change to use a new feature added in this release.
