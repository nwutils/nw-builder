import assert from "node:assert";
import fs from "node:fs";
import fsm from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { describe, it } from "node:test";

describe("get", async () => {

    const options = {
        version: "0.82.0",
        flavor: "sdk",
        platform: "osx",
        arch: "x64",
        downloadUrl: "https://dl.nwjs.io",
        cacheDir: "test/fixture/cache",
        cache: true,
        ffmpeg: false,
        nativeAddon: false,
    };

    it("downloads macos binary", async function () {
        assert.strictEqual(fs.existsSync(path.resolve(process.cwd(), options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app")), true);
    });

    it("preserves symlinks on macos build", async function () {
        // await get({...options})
        const frameworksPath = path.resolve(process.cwd(), options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
        const symlinks = [
            path.join(frameworksPath, "Helpers"),
            path.join(frameworksPath, "Libraries"),
            path.join(frameworksPath, "nwjs Framework"),
            path.join(frameworksPath, "Resources"),
            path.join(frameworksPath, "Versions", "Current"),
        ];

        for (const symlink of symlinks) {
            const stats = await fsm.lstat(symlink);
            assert.strictEqual(stats.isSymbolicLink(), true);
        }
    });
});
