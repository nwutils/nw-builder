import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import util from "../../../packages/packager/src/util.js";

describe("packager/util", function () {
  describe("fileExists", function () {
    let tmpDir;

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-util-test-"),
      );
    });

    after(async function () {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    it("resolves true when the path exists", async function () {
      assert.strictEqual(await util.fileExists(tmpDir), true);
    });

    it("resolves false when the path does not exist", async function () {
      assert.strictEqual(
        await util.fileExists(path.join(tmpDir, "does-not-exist")),
        false,
      );
    });
  });

  describe("parseDesktopEntry", function () {
    it("parses keys from the [Desktop Entry] group", function () {
      const contents = [
        "[Desktop Entry]",
        "Type=Application",
        "Name=Demo",
        "Icon=/path/to/icon.png",
        "",
      ].join("\n");

      assert.deepStrictEqual(util.parseDesktopEntry(contents), {
        Type: "Application",
        Name: "Demo",
        Icon: "/path/to/icon.png",
      });
    });

    it("ignores keys outside of the [Desktop Entry] group", function () {
      const contents = [
        "[Desktop Entry]",
        "Name=Demo",
        "[Desktop Action Foo]",
        "Name=Foo Action",
        "",
      ].join("\n");

      assert.deepStrictEqual(util.parseDesktopEntry(contents), {
        Name: "Demo",
      });
    });

    it("ignores blank lines and comments", function () {
      const contents = [
        "[Desktop Entry]",
        "# a comment",
        "",
        "Name=Demo",
        "",
      ].join("\n");

      assert.deepStrictEqual(util.parseDesktopEntry(contents), {
        Name: "Demo",
      });
    });
  });

  describe("stringifyDesktopEntry", function () {
    it("writes a [Desktop Entry] group with one key per line", function () {
      const fileContent = util.stringifyDesktopEntry({
        Type: "Application",
        Name: "Demo",
      });

      assert.strictEqual(
        fileContent,
        "[Desktop Entry]\nType=Application\nName=Demo\n",
      );
    });

    it("omits keys with undefined values", function () {
      const fileContent = util.stringifyDesktopEntry({
        Type: "Application",
        Name: undefined,
      });

      assert.strictEqual(fileContent, "[Desktop Entry]\nType=Application\n");
    });
  });
});
