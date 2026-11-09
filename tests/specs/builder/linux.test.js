import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import build from "../../../packages/builder/src/main.js";

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
