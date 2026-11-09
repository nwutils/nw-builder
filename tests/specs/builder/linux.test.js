import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import build, {
  validateProtocols,
} from "../../../packages/builder/src/main.js";

describe("builder Linux desktop entry", () => {
  let tmp = "";
  /** @type {Record<string, string>} */
  let entry = {};

  before(async () => {
    tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nwbuild-linux-"));
    const srcDir = path.join(tmp, "src");
    const cacheDir = path.join(tmp, "cache");
    const outDir = path.join(tmp, "out");
    // A stand-in for the NW.js Linux build in the cache, so no download is needed.
    const nwDir = path.join(cacheDir, "nwjs-v0.0.0-linux-x64");
    await fs.promises.mkdir(nwDir, { recursive: true });
    await fs.promises.writeFile(path.join(nwDir, "nw"), "");
    await fs.promises.mkdir(srcDir);
    await fs.promises.writeFile(
      path.join(srcDir, "package.json"),
      JSON.stringify({ name: "demo", main: "index.html" }),
    );

    await build({
      srcDir,
      cacheDir,
      outDir,
      version: "0.0.0",
      platform: "linux",
      arch: "x64",
      glob: false,
      app: /** @type {any} */ ({
        name: "Demo",
        mimeType: ["text/plain", "image/png"],
        categories: ["Utility", "Development"],
        keywords: ["notes", "a;b"],
        onlyShowIn: "GNOME;KDE;",
      }),
    });

    const contents = await fs.promises.readFile(
      path.join(outDir, "Demo.desktop"),
      "utf-8",
    );
    entry = Object.fromEntries(
      contents
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => [
          line.slice(0, line.indexOf("=")),
          line.slice(line.indexOf("=") + 1),
        ]),
    );
  });

  after(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  });

  it("writes array values as semicolon terminated lists", () => {
    assert.equal(entry.MimeType, "text/plain;image/png;");
    assert.equal(entry.Categories, "Utility;Development;");
  });

  it("escapes semicolons inside list items", () => {
    assert.equal(entry.Keywords, "notes;a\\;b;");
  });

  it("writes string values as given", () => {
    assert.equal(entry.OnlyShowIn, "GNOME;KDE;");
  });
});

/**
 * Build a Linux app from a stand-in NW.js build and parse its desktop entry.
 * @param  {object} app  `app` options for `build()`.
 * @returns {Promise<Record<string, string>>}
 */
async function buildDesktopEntry(app) {
  const tmp = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "nwbuild-linux-"),
  );
  try {
    const nwDir = path.join(tmp, "cache", "nwjs-v0.0.0-linux-x64");
    await fs.promises.mkdir(nwDir, { recursive: true });
    await fs.promises.writeFile(path.join(nwDir, "nw"), "");
    await fs.promises.mkdir(path.join(tmp, "src"));
    await fs.promises.writeFile(
      path.join(tmp, "src", "package.json"),
      JSON.stringify({ name: "demo", main: "index.html" }),
    );
    await build({
      srcDir: path.join(tmp, "src"),
      cacheDir: path.join(tmp, "cache"),
      outDir: path.join(tmp, "out"),
      version: "0.0.0",
      platform: "linux",
      arch: "x64",
      glob: false,
      app: /** @type {any} */ (app),
    });
    const contents = await fs.promises.readFile(
      path.join(tmp, "out", `${/** @type {any} */ (app).name}.desktop`),
      "utf-8",
    );
    return Object.fromEntries(
      contents
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => [
          line.slice(0, line.indexOf("=")),
          line.slice(line.indexOf("=") + 1),
        ]),
    );
  } finally {
    await fs.promises.rm(tmp, { recursive: true, force: true });
  }
}

describe("builder Linux deep links", () => {
  it("adds scheme handlers to MimeType and %U to Exec", async () => {
    const entry = await buildDesktopEntry({
      name: "Demo",
      exec: "/opt/demo/Demo",
      mimeType: ["text/plain"],
      protocols: ["myapp", "my-app.v2"],
    });
    assert.equal(
      entry.MimeType,
      "text/plain;x-scheme-handler/myapp;x-scheme-handler/my-app.v2;",
    );
    assert.equal(entry.Exec, "/opt/demo/Demo %U");
  });

  it("merges with a MimeType string and keeps an Exec that takes URLs", async () => {
    const entry = await buildDesktopEntry({
      name: "Demo",
      exec: "/opt/demo/Demo %u",
      mimeType: "text/plain;x-scheme-handler/myapp;",
      protocols: ["myapp"],
    });
    assert.equal(entry.MimeType, "text/plain;x-scheme-handler/myapp;");
    assert.equal(entry.Exec, "/opt/demo/Demo %u");
  });

  it("leaves the desktop entry alone without protocols", async () => {
    const entry = await buildDesktopEntry({
      name: "Demo",
      exec: "/opt/demo/Demo",
    });
    assert.equal(entry.MimeType, undefined);
    assert.equal(entry.Exec, "/opt/demo/Demo");
  });
});

describe("builder validateProtocols", () => {
  it("accepts custom schemes", () => {
    validateProtocols(undefined);
    validateProtocols([]);
    validateProtocols(["myapp", "my-app.v2", "a+b"]);
  });

  for (const [name, value, message] of [
    ["a string", "myapp", /array of URL schemes/],
    ["uppercase", ["MyApp"], /lowercase URL scheme/],
    ["a scheme with ://", ["myapp://"], /lowercase URL scheme/],
    ["a leading digit", ["1app"], /lowercase URL scheme/],
    ["https", ["https"], /belongs to the browser or the OS/],
    ["duplicates", ["myapp", "myapp"], /no duplicates/],
  ]) {
    it(`rejects ${name}`, () => {
      assert.throws(() => validateProtocols(value), message);
    });
  }

  it("rejects invalid protocols before building", async () => {
    await assert.rejects(
      buildDesktopEntry({ name: "Demo", protocols: ["https"] }),
      /belongs to the browser or the OS/,
    );
  });
});
