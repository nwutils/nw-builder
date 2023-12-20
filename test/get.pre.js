import get from "../src/get.js";

// TODO: fix get function and move this into a before hook
// Running this inside a before hook makes the test suite fail.
// There is likely some asyncronous behaviour that is not being handled properly.
// This allows the test suite to pass.
await get({
    version: "0.82.0",
    flavor: "sdk",
    platform: "osx",
    arch: "x64",
    downloadUrl: "https://dl.nwjs.io",
    cacheDir: "test/fixture/cache",
    cache: true,
    ffmpeg: false,
    nativeAddon: false,
});
