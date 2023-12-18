import fs from "node:fs";

fs.stat("./test/fixture/cache/nwjs-sdk-v0.82.0-osx-x64/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Helpers", (err, stats) => {
    console.log(stats.isSymbolicLink())
});
