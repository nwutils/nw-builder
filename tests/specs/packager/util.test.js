import assert from "node:assert/strict";
import child_process from "node:child_process";
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
  describe("updateInfoFileName", function () {
    it("uses the bare name for x64 and suffixes other architectures", function () {
      assert.strictEqual(util.updateInfoFileName("x64"), "latest-linux.yml");
      assert.strictEqual(
        util.updateInfoFileName("arm64"),
        "latest-linux-arm64.yml",
      );
      assert.strictEqual(
        util.updateInfoFileName("ia32"),
        "latest-linux-ia32.yml",
      );
    });
  });

  describe("stringifyYaml", function () {
    it("writes scalars and lists of maps, quoting strings", function () {
      const fileContent = util.stringifyYaml({
        version: "1.2.0",
        files: [{ url: "Demo.AppImage", size: 10 }],
        note: 'say "hi"',
        skipped: undefined,
      });

      assert.strictEqual(
        fileContent,
        [
          'version: "1.2.0"',
          "files:",
          '  - url: "Demo.AppImage"',
          "    size: 10",
          'note: "say \\"hi\\""',
          "",
        ].join("\n"),
      );
    });
  });

  describe("sha512", function () {
    it("returns the base64 encoded SHA-512 digest of a file", async function () {
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-util-test-"),
      );
      try {
        const filePath = path.join(tmpDir, "file.txt");
        await fs.promises.writeFile(filePath, "abc");

        assert.strictEqual(
          await util.sha512(filePath),
          "3a81oZNherrMQXNJriBBMRLm+k6JqX6iCp7u5ktV05ohkpkqJ0/BqDa6PCOj/uu9RU1EI2Q86A4qmslPpUyknw==",
        );
      } finally {
        await fs.promises.rm(tmpDir, { recursive: true, force: true });
      }
    });
  });
  describe("stringifyDesktopEntry hardening", function () {
    it("rejects values containing line breaks", function () {
      assert.throws(
        () => util.stringifyDesktopEntry({ Name: "Demo\nExec=evil" }),
        /must not contain line breaks/,
      );
      assert.throws(
        () => util.stringifyDesktopEntry({ Name: "Demo\rExec=evil" }),
        /must not contain line breaks/,
      );
    });
  });

  describe("shellQuote", function () {
    it("makes sh treat any string as a single literal word", function () {
      for (const value of [
        "Demo",
        "My App",
        "$(touch pwned)",
        "`id`",
        "it's",
        "'; echo injected; '",
        '"$HOME"',
        "back\\slash",
      ]) {
        const output = child_process.execFileSync(
          "sh",
          ["-c", `printf %s ${util.shellQuote(value)}`],
          { encoding: "utf-8" },
        );
        assert.strictEqual(output, value);
      }
    });
  });

  describe("desktopExecArg", function () {
    it("leaves plain names as-is", function () {
      assert.strictEqual(util.desktopExecArg("Demo"), "Demo");
    });

    it("doubles percent signs so they aren't read as field codes", function () {
      assert.strictEqual(util.desktopExecArg("50%f"), "50%%f");
    });

    it("quotes and escapes names with reserved characters", function () {
      assert.strictEqual(util.desktopExecArg("My App"), '"My App"');
      /* `"`, `` ` ``, `$` and `\` are backslash-escaped, then every backslash is escaped again. */
      assert.strictEqual(
        util.desktopExecArg('a"b`c$d\\e'),
        '"a\\\\"b\\\\`c\\\\$d\\\\\\\\e"',
      );
    });
  });

  describe("nsisEscape", function () {
    it("leaves plain strings as-is", function () {
      assert.strictEqual(util.nsisEscape("Demo App"), "Demo App");
    });

    it("doubles $ and escapes double quotes", function () {
      assert.strictEqual(util.nsisEscape('a$INSTDIR"b'), 'a$$INSTDIR$\\"b');
    });

    it("throws on line breaks", function () {
      assert.throws(
        () => util.nsisEscape("a\nb"),
        /must not contain line breaks/,
      );
      assert.throws(
        () => util.nsisEscape("a\rb"),
        /must not contain line breaks/,
      );
    });
  });

  describe("nsisPath", function () {
    it("returns paths unchanged, including a plain $", function () {
      assert.strictEqual(util.nsisPath("/tmp/a$b/c.exe"), "/tmp/a$b/c.exe");
    });

    it("throws on sequences makensis would interpret", function () {
      for (const value of ["/a/${X}", "/a/$\\n", '/a/"b"', "/a/\nb"]) {
        assert.throws(() => util.nsisPath(value), /Paths passed to NSIS/);
      }
    });
  });

  describe("isWindowsFileName", function () {
    it("accepts ordinary file names", function () {
      for (const value of ["Demo", "My App", "demo.v2", "con-app", "Ünïcode"]) {
        assert.strictEqual(util.isWindowsFileName(value), true, value);
      }
    });

    it("rejects names Windows can't use", function () {
      for (const value of [
        "",
        "a/b",
        "a\\b",
        "a:b",
        "a*b",
        'a"b',
        "a\tb",
        "trailing.",
        "trailing ",
        "CON",
        "nul.txt",
        "Com1",
      ]) {
        assert.strictEqual(util.isWindowsFileName(value), false, value);
      }
    });
  });

  describe("windowsVersion", function () {
    it("pads versions to four parts", function () {
      assert.strictEqual(util.windowsVersion("1"), "1.0.0.0");
      assert.strictEqual(util.windowsVersion("1.2.3"), "1.2.3.0");
      assert.strictEqual(util.windowsVersion("1.2.3.4"), "1.2.3.4");
    });

    it("drops prerelease and build suffixes", function () {
      assert.strictEqual(util.windowsVersion("1.2.3-beta.1"), "1.2.3.0");
      assert.strictEqual(util.windowsVersion("1.2.3+sha.abc"), "1.2.3.0");
    });

    it("throws on versions that don't start with a number", function () {
      assert.throws(
        () => util.windowsVersion("v1.2.3"),
        /starting with a number/,
      );
    });

    it("throws on parts above 65535", function () {
      assert.throws(() => util.windowsVersion("1.65536.0"), /at most 65535/);
    });
  });
});
