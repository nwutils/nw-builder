import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import * as peLibrary from "pe-library";
import * as resedit from "resedit";

import build, {
  setRequestedExecutionLevel,
} from "../../../packages/builder/src/main.js";

const RT_MANIFEST = 24;
const EN_US = 1033;

/* The application manifest NW.js ships in nw.exe. */
const NW_MANIFEST = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="asInvoker" uiAccess="false"/>
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
`;

/**
 * A stand-in for NW.js' nw.exe: a PE file with version info and an
 * application manifest, so no download is needed.
 * @returns {Buffer}
 */
function fakeNwExe() {
  const exe = peLibrary.NtExecutable.createEmpty(false, false);
  const res = peLibrary.NtExecutableResource.from(exe);
  res.entries.push({
    type: RT_MANIFEST,
    id: 1,
    lang: EN_US,
    codepage: 0,
    bin: Uint8Array.from(Buffer.from(NW_MANIFEST, "utf8")).buffer,
  });
  const vi = resedit.Resource.VersionInfo.createEmpty();
  vi.lang = EN_US;
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  return Buffer.from(exe.generate());
}

/**
 * `requestedExecutionLevel` element(s) in the executable's manifest.
 * @param {string} exePath  Path to the executable.
 * @returns {Promise<string[]>}
 */
async function executionLevels(exePath) {
  const exe = peLibrary.NtExecutable.from(await fs.promises.readFile(exePath));
  const res = peLibrary.NtExecutableResource.from(exe);
  return res.entries
    .filter((entry) => entry.type === RT_MANIFEST)
    .map(
      (entry) =>
        Buffer.from(entry.bin)
          .toString("utf8")
          .match(/<requestedExecutionLevel[^>]*>/)?.[0] ?? "",
    );
}

describe("builder Windows requestedExecutionLevel", () => {
  let tmp = "";

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwbuild-win-"));
    const nwDir = path.join(tmp, "cache", "nwjs-v0.0.0-win-x64");
    await fs.promises.mkdir(nwDir, { recursive: true });
    await fs.promises.writeFile(path.join(nwDir, "nw.exe"), fakeNwExe());
    await fs.promises.mkdir(path.join(tmp, "src"));
    await fs.promises.writeFile(
      path.join(tmp, "src", "package.json"),
      JSON.stringify({ name: "demo", main: "index.html" }),
    );
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  /**
   * Build for Windows with `app` options.
   * @param {string} name  Out directory name.
   * @param {Record<string, unknown>} app  App options.
   * @returns {Promise<string>} Path to the built executable.
   */
  async function buildWin(name, app) {
    const outDir = path.join(tmp, name);
    await build({
      srcDir: path.join(tmp, "src"),
      cacheDir: path.join(tmp, "cache"),
      outDir,
      version: "0.0.0",
      platform: "win",
      arch: "x64",
      glob: false,
      app: /** @type {any} */ ({
        name: "Demo",
        fileVersion: "1.0.0",
        productVersion: "1.0.0",
        languageCode: EN_US,
        ...app,
      }),
    });
    return path.join(outDir, "Demo.exe");
  }

  it("keeps NW.js' asInvoker by default", async () => {
    assert.deepStrictEqual(
      await executionLevels(await buildWin("default", {})),
      ['<requestedExecutionLevel level="asInvoker" uiAccess="false"/>'],
    );
  });

  it("sets requireAdministrator", async () => {
    const exe = await buildWin("admin", {
      requestedExecutionLevel: "requireAdministrator",
    });
    assert.deepStrictEqual(await executionLevels(exe), [
      '<requestedExecutionLevel level="requireAdministrator" uiAccess="false"/>',
    ]);
  });

  it("sets highestAvailable", async () => {
    const exe = await buildWin("highest", {
      requestedExecutionLevel: "highestAvailable",
    });
    assert.deepStrictEqual(await executionLevels(exe), [
      '<requestedExecutionLevel level="highestAvailable" uiAccess="false"/>',
    ]);
  });

  it("throws on an invalid level", () => {
    assert.throws(
      () => setRequestedExecutionLevel([], "admin"),
      /Expected app\.requestedExecutionLevel to be one of/,
    );
  });

  it("throws when the executable has no manifest", () => {
    assert.throws(
      () => setRequestedExecutionLevel([], "requireAdministrator"),
      /has no application manifest/,
    );
  });

  it("supports single quoted attributes", () => {
    const entries = [
      {
        type: RT_MANIFEST,
        id: 1,
        lang: EN_US,
        codepage: 0,
        bin: Uint8Array.from(
          Buffer.from("<requestedExecutionLevel level='asInvoker'/>"),
        ).buffer,
      },
    ];
    setRequestedExecutionLevel(entries, "requireAdministrator");
    assert.strictEqual(
      Buffer.from(entries[0].bin).toString("utf8"),
      "<requestedExecutionLevel level='requireAdministrator'/>",
    );
  });
});
