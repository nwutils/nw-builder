import assert from "node:assert";
import fsm from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import get from "../src/get.js";

test("preserves symlinks on macos build", async function () {
    const options = {
        version: "0.82.0",
        flavor: "sdk",
        platform: "osx",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        cacheDir: "./test/fixture/cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
    };

    await get(options);

    const frameworksPath = path.join(process.cwd(), options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
    const symlinks = [
        path.join(frameworksPath, "Helpers"),
        path.join(frameworksPath, "Libraries"),
        path.join(frameworksPath, "nwjs Framework"),
        path.join(frameworksPath, "Resources"),
        path.join(frameworksPath, "Versions", "Current"),
    ];

    for await (const symlink of symlinks) {
        const stats = await fsm.lstat(symlink);
        assert.strictEqual(stats.isSymbolicLink(), true);
    }
});
