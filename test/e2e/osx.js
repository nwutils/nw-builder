import { equal } from "node:assert";
import { basename, resolve } from "node:path";
import { before, describe, it } from "node:test";

import nwbuild from "nw-builder";

describe("osx specific tests", () => {
  let nwOptions = {};

  before(async () => {
    nwOptions = {
      srcDir: "test/fixture/app",
      mode: "build",
      version: "0.80.0",
      platform: "osx",
      arch: "x64",
      outDir: "test/fixture/out",
      cacheDir: "test/fixture/cache",
      glob: false,
      app: {
        name: "demo",
        icon: "app/icon.icns",
        CFBundleIdentifier: "io.nwutils.demo",
        CFBundleName: "demo",
        CFBundleDisplayName: "demo",
        CFBundleVersion: "0.0.0",
        CFBundleShortVersionString: "0.0.0",
        NSHumanReadableCopyright: "Copyright (c) 2023 NW.js Utilities",
      },
    };

    await nwbuild(nwOptions);
  });

  it("renames nwjs.app to `options.app.name`.app", () => {
    const appName = basename(
      resolve(nwOptions.outDir, `${nwOptions.app.name}.app`),
      ".app",
    );

    equal(appName, "demo");
  });

  it("renames Contents/MacOS/nwjs to Contents/MacOS/${options.app.name}", () => {
    const appName = basename(
      resolve(nwOptions.outDir, `${nwOptions.app.name}.app`, "Contents", "MacOS", nwOptions.app.name)
    );

    equal(appName, "demo");
  });

});
