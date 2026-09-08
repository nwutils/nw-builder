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

  /** Minimal fully-resolved options that pass every check up to the `mode === "package"` block. */
  const basePackageOptions = {
    mode: "package",
    flavor: "normal",
    platform: "linux",
    arch: "x64",
    downloadUrl: "file://path/to/fs",
    manifestUrl: "https://path/to/manifest",
    cacheDir: "./path/to/cache",
    cache: true,
    ffmpeg: false,
    logLevel: "info",
    shaSum: true,
    srcDir: "./src",
    argv: [],
    glob: true,
    outDir: "./out",
    managedManifest: false,
    nativeAddon: false,
    zip: false,
    format: "AppImage",
    app: {},
  };
  const packageReleaseInfo = { flavors: ["normal"], files: ["linux-x64"] };

  it("throws error on an unknown format", async function () {
    await assert.rejects(
      util.validate(
        { ...basePackageOptions, format: "snap" },
        packageReleaseInfo,
      ),
      /Expected options\.format to be one of/,
    );
  });

  it("throws error when format doesn't match platform", async function () {
    await assert.rejects(
      util.validate(
        { ...basePackageOptions, format: "MSIX" },
        packageReleaseInfo,
      ),
      /options\.format "MSIX" requires options\.platform "win"/,
    );
  });

  it("throws error on a recognised but unimplemented format", async function () {
    await assert.rejects(
      util.validate(
        { ...basePackageOptions, platform: "win", arch: "x64", format: "NSIS" },
        { flavors: ["normal"], files: ["win-x64"] },
      ),
      /options\.format "NSIS" is not implemented yet/,
    );
  });

  it("throws error when package mode is combined with zip", async function () {
    await assert.rejects(
      util.validate({ ...basePackageOptions, zip: "zip" }, packageReleaseInfo),
      /options\.zip is not supported/,
    );
  });

  it("resolves for a valid package mode configuration", async function () {
    await assert.doesNotReject(
      util.validate(basePackageOptions, packageReleaseInfo),
    );
  });
});

describe("util/parse", function () {
  // It is the job of the respective `set<platformName>Config` to resolve the app.icon path
  it("doesnt resolve app.icon", async function () {
    const newOptions = await util.parse({ app: { icon: "." } }, {});
    assert.strictEqual(newOptions.app.icon, ".");
  });

  it("defaults format to AppImage on linux", async function () {
    const newOptions = await util.parse({ platform: "linux" }, {});
    assert.strictEqual(newOptions.format, "AppImage");
  });

  it("leaves format undefined on other platforms", async function () {
    const newOptions = await util.parse({ platform: "win" }, {});
    assert.strictEqual(newOptions.format, undefined);
  });

  it("respects an explicit format", async function () {
    const newOptions = await util.parse(
      { platform: "linux", format: "deb" },
      {},
    );
    assert.strictEqual(newOptions.format, "deb");
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
