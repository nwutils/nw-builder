import assert from "node:assert";
import { existsSync, promises } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { describe, it, before } from "node:test";

import get from '../src/get.js';

describe("get", async () => {
    const nwOptions = {
        version: "0.83.0",
        flavor: "sdk",
        platform: "osx",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        cacheDir: "test/fixture/cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
    };

    before(async () => {
        await get(nwOptions);
    });

    it("downloads macos binary", async function () {
        assert.strictEqual(existsSync(resolve(cwd(), nwOptions.cacheDir, `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${nwOptions.platform}-${nwOptions.arch}`, "nwjs.app")), true);
    });

    it("preserves symlinks on macos build", async function () {
        const frameworksPath = resolve(cwd(), nwOptions.cacheDir, `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${nwOptions.platform}-${nwOptions.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
        const symlinks = [
            join(frameworksPath, "Helpers"),
            join(frameworksPath, "Libraries"),
            join(frameworksPath, "nwjs Framework"),
            join(frameworksPath, "Resources"),
            join(frameworksPath, "Versions", "Current"),
        ];

        for (const symlink of symlinks) {
            const stats = await promises.lstat(symlink);
            assert.strictEqual(stats.isSymbolicLink(), true);
        }
    });
});
