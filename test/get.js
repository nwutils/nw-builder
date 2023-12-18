import assert from "node:assert";
import fsm from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

import get from "../src/get.js";

describe("get mode", function () {
    it("decompresses file and preserves symlinks on macos", async () => {
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

        const symlinks = [
            [options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework", "Helpers"].join('/'),
            [options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework", "Libraries"].join('/'),
            [options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework", "nwjs Framework"].join('/'),
            [options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework", "Resources"].join('/'),
            [options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework", "Versions", "Current"].join('/'),
        ];

        for await (const symlink of symlinks) {
            const link = await fsm.stat(path.resolve(symlink));
            assert.strictEqual(link.isSymbolicLink(), true);
        }
    })
});