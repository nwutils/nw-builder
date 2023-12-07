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

        const nwDir = path.resolve(
            options.cacheDir,
            `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`,
        );

        const helpersPath = await fsm.stat(
            path.resolve(
                nwDir,
                "nwjs.app",
                "Contents",
                "Frameworks",
                "nwjs Framework.framework",
                "Helpers"
            )
        );
        const librariesPath = await fsm.stat(
            path.resolve(
                nwDir,
                "nwjs.app",
                "Contents",
                "Frameworks",
                "nwjs Framework.framework",
                "Libraries"
            )
        );
        const frameworkPath = await fsm.stat(
            path.resolve(
                nwDir,
                "nwjs.app",
                "Contents",
                "Frameworks",
                "nwjs Framework.framework",
                "nwjs Framework"
            )
        );
        const resourcesPath = await fsm.stat(
            path.resolve(
                nwDir,
                "nwjs.app",
                "Contents",
                "Frameworks",
                "nwjs Framework.framework",
                "Resources"
            )
        );
        const versionCurrentPath = await fsm.stat(
            path.resolve(
                nwDir,
                "nwjs.app",
                "Contents",
                "Frameworks",
                "nwjs Framework.framework",
                "Versions",
                "Current"
            )
        );

        assert.strictEqual(helpersPath.isSymbolicLink(), true);
        assert.strictEqual(librariesPath.isSymbolicLink(), true);
        assert.strictEqual(frameworkPath.isSymbolicLink(), true);
        assert.strictEqual(resourcesPath.isSymbolicLink(), true);
        assert.strictEqual(versionCurrentPath.isSymbolicLink(), true);
    });
});