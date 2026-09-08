import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";

import util from "../../../packages/nw-builder/src/util.js";

const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..");

describe("util/log", function () {
  it("shows only error message if log level is error", async function () {
    assert.strictEqual(
      util.log("error", "error", "Lorem ipsum"),
      "[ ERROR ] Lorem ipsum",
    );
  });

  it("shows only error message if log level is debug", async function () {
    assert.strictEqual(util.log("debug", "error", "Lorem ipsum"), "");
  });

  it("throws error if message severity is invalid", async function () {
    assert.throws(() => util.log("debuggy", "error", "Lorem ipsum"));
  });

  it("throws error if user defined log level is invalid", async function () {
    assert.throws(() => util.log("debug", "errory", "Lorem ipsum"));
  });
});

describe("util/validate", function () {
  it("throws error on invalid mode", async function () {
    await assert.rejects(util.validate({ mode: "gety" }, {}), Error);
  });

  it("throws error if releases info is undefined", async function () {
    await assert.rejects(util.validate({ mode: "get" }, undefined), Error);
  });

  it("throws error on invalid flavor", async function () {
    await assert.rejects(
      util.validate(
        { mode: "get", flavor: "notsdk" },
        { flavours: ["normal"] },
      ),
      Error,
    );
  });

  it("throws error on invalid platform", async function () {
    await assert.rejects(
      util.validate(
        { mode: "get", flavor: "normal", platform: "linox" },
        { flavours: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid architecture", async function () {
    await assert.rejects(
      util.validate(
        { mode: "get", flavor: "normal", platform: "linux", arch: "x64000" },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid download url", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "get",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: null,
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid manifest url", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "get",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: null,
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid cache directory", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "get",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: "http://path/to/manifest",
          cacheDir: null,
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid cache flag", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "get",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: "http://path/to/manifest",
          cacheDir: "./path/to/cache",
          cache: "true",
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid ffmpeg flag", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "get",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: "http://path/to/manifest",
          cacheDir: "./path/to/cache",
          cache: true,
          ffmpeg: "true",
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error on invalid format in package mode", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "package",
          flavor: "normal",
          platform: "linux",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: "http://path/to/manifest",
          cacheDir: "./path/to/cache",
          cache: true,
          ffmpeg: false,
          logLevel: "info",
          shaSum: true,
          srcDir: "./",
          argv: [],
          glob: true,
          outDir: "./out",
          managedManifest: false,
          nativeAddon: false,
          zip: false,
          format: "exe",
        },
        { flavors: ["normal"], files: ["linux-x64"] },
      ),
      Error,
    );
  });

  it("throws error when format AppImage is used on a non-linux platform", async function () {
    await assert.rejects(
      util.validate(
        {
          mode: "package",
          flavor: "normal",
          platform: "win",
          arch: "x64",
          downloadUrl: "file://path/to/fs",
          manifestUrl: "http://path/to/manifest",
          cacheDir: "./path/to/cache",
          cache: true,
          ffmpeg: false,
          logLevel: "info",
          shaSum: true,
          srcDir: "./",
          argv: [],
          glob: true,
          outDir: "./out",
          managedManifest: false,
          nativeAddon: false,
          zip: false,
          format: "AppImage",
        },
        { flavors: ["normal"], files: ["win-x64"] },
      ),
      Error,
    );
  });
});

describe("util/parse", function () {
  // It is the job of the respective `set<platformName>Config` to resolve the app.icon path
  it("doesnt resolve app.icon", async function () {
    const newOptions = await util.parse({ app: { icon: "." } }, {});
    assert.strictEqual(newOptions.app.icon, ".");
  });

  it("defaults format to AppImage in package mode on linux", async function () {
    const newOptions = await util.parse(
      { mode: "package", platform: "linux" },
      {},
    );
    assert.strictEqual(newOptions.format, "AppImage");
  });

  it("leaves format undefined in package mode on non-linux platforms", async function () {
    const newOptions = await util.parse(
      { mode: "package", platform: "win" },
      {},
    );
    assert.strictEqual(newOptions.format, undefined);
  });

  it("does not set format outside of package mode", async function () {
    const newOptions = await util.parse(
      { mode: "build", platform: "linux" },
      {},
    );
    assert.strictEqual(newOptions.format, undefined);
  });
});

describe("util/getManifest", function () {
  it("parses local file correctly", async function () {
    const localManifestFile = JSON.parse(
      await util.getManifest(
        `file:///${path.join(repoRoot, "tests/fixtures/nw-builder/util/getManifest_manifest.json")}`,
      ),
    );
    assert.strictEqual(localManifestFile.latest, "v0.106.1");
  });
});
