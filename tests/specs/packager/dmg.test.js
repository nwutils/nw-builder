import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, beforeEach, describe, it } from "node:test";

import dmg from "../../../packages/packager/src/dmg.js";

const fakeMacTool = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "fixtures",
  "packager",
  "bin",
  "fake-mac-tool.cjs",
);

describe(
  "packager/dmg",
  /* The stand-in tools are Node.js scripts started through their shebang. */
  { skip: process.platform === "win32" },
  function () {
    let tmpDir = "";
    let appDir = "";
    let binDir = "";
    let logPath = "";
    /** @type {{hdiutilPath: string, dittoPath: string, codesignPath: string}} */
    let tools;

    before(async function () {
      tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "nwutils-packager-dmg-test-"),
      );

      /* A minimal app bundle, with a framework symlink like NW.js has. */
      appDir = path.join(tmpDir, "out");
      const contents = path.join(appDir, "Demo.app", "Contents");
      const framework = path.join(
        contents,
        "Frameworks",
        "nwjs Framework.framework",
      );
      await fs.promises.mkdir(path.join(contents, "MacOS"), {
        recursive: true,
      });
      await fs.promises.mkdir(path.join(contents, "Resources"), {
        recursive: true,
      });
      await fs.promises.mkdir(path.join(framework, "Versions", "A"), {
        recursive: true,
      });
      await fs.promises.writeFile(
        path.join(contents, "Info.plist"),
        "<plist/>",
      );
      await fs.promises.writeFile(path.join(contents, "MacOS", "Demo"), "", {
        mode: 0o755,
      });
      await fs.promises.symlink(
        "A",
        path.join(framework, "Versions", "Current"),
      );

      binDir = path.join(tmpDir, "bin");
      await fs.promises.mkdir(binDir);
      for (const tool of ["hdiutil", "ditto", "codesign"]) {
        await fs.promises.copyFile(fakeMacTool, path.join(binDir, tool));
        await fs.promises.chmod(path.join(binDir, tool), 0o755);
      }
      tools = {
        hdiutilPath: path.join(binDir, "hdiutil"),
        dittoPath: path.join(binDir, "ditto"),
        codesignPath: path.join(binDir, "codesign"),
      };
    });

    beforeEach(async function () {
      logPath = path.join(tmpDir, `tools-${crypto.randomUUID()}.log`);
      process.env.FAKE_MAC_TOOL_LOG = logPath;
    });

    after(async function () {
      delete process.env.FAKE_MAC_TOOL_LOG;
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    });

    /**
     * @returns {Promise<{tool: string, args: string[], contents?: string[], appUpdateYaml?: string}[]>}
     */
    async function toolCalls() {
      if (fs.existsSync(logPath) === false) {
        return [];
      }
      return (await fs.promises.readFile(logPath, "utf-8"))
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
    }

    it("throws when appDir does not exist", async function () {
      await assert.rejects(
        dmg({ appDir: path.join(tmpDir, "nope"), appName: "Demo" }),
        /does not exist/,
      );
    });

    it("throws when the app bundle is missing", async function () {
      await assert.rejects(
        dmg({ appDir, appName: "NotDemo", ...tools }),
        /Expected the app bundle to exist/,
      );
    });

    it("throws on an architecture MacOS doesn't have", async function () {
      await assert.rejects(
        dmg({
          appDir,
          appName: "Demo",
          arch: /** @type {"x64"} */ (/** @type {unknown} */ ("ia32")),
        }),
        /Expected "options.arch" to be "x64" or "arm64"/,
      );
    });

    it("throws on an appName that isn't a file name", async function () {
      await assert.rejects(
        dmg({ appDir, appName: "../Demo" }),
        /Expected "options.appName" to be a non-empty file name/,
      );
    });

    it("throws when publish is set without version", async function () {
      await assert.rejects(
        dmg({
          appDir,
          appName: "Demo",
          publish: { provider: "github", owner: "nwutils", repo: "demo" },
        }),
        /Expected "options.version" to be a non-empty string when "options.publish" is set/,
      );
    });

    it("throws a helpful error when hdiutil is missing", async function () {
      await assert.rejects(
        dmg({
          appDir,
          appName: "Demo",
          outDir: path.join(tmpDir, "out-missing"),
          hdiutilPath: path.join(tmpDir, "no-hdiutil"),
        }),
        /"hdiutil" is part of MacOS, so DMGs are built on a MacOS host/,
      );
    });

    it("puts the app and a link to /Applications in the DMG", async function () {
      const outDir = path.join(tmpDir, "out-plain");

      const dmgPath = await dmg({
        appDir,
        appName: "Demo",
        arch: "arm64",
        outDir,
        ...tools,
      });

      assert.strictEqual(dmgPath, path.join(outDir, "Demo-arm64.dmg"));
      assert.strictEqual(
        await fs.promises.readFile(dmgPath, "utf-8"),
        "fake dmg\n",
      );
      const calls = await toolCalls();
      assert.deepStrictEqual(
        calls.map((call) => call.tool),
        ["hdiutil"],
      );
      const [hdiutil] = calls;
      assert.deepStrictEqual(hdiutil.args.slice(0, 3), [
        "create",
        "-volname",
        "Demo",
      ]);
      assert.deepStrictEqual(hdiutil.args.slice(-6), [
        "-fs",
        "HFS+",
        "-format",
        "UDZO",
        "-ov",
        dmgPath,
      ]);
      assert.ok(hdiutil.contents?.includes("Applications -> /Applications"));
      assert.ok(hdiutil.contents?.includes("Demo.app/Contents/MacOS/Demo"));
      assert.ok(
        hdiutil.contents?.includes(
          "Demo.app/Contents/Frameworks/nwjs Framework.framework/Versions/Current -> A",
        ),
        "framework symlinks must stay symlinks",
      );
      assert.strictEqual(hdiutil.appUpdateYaml, undefined);
      assert.deepStrictEqual(await fs.promises.readdir(outDir), [
        "Demo-arm64.dmg",
      ]);
    });

    it("signs the app before creating the DMG", async function () {
      await dmg({
        appDir,
        appName: "Demo",
        arch: "x64",
        outDir: path.join(tmpDir, "out-signed"),
        signIdentity: "Developer ID Application: ACME (TEAMID)",
        ...tools,
      });

      const [codesign, hdiutil] = await toolCalls();
      assert.strictEqual(codesign.tool, "codesign");
      assert.deepStrictEqual(codesign.args.slice(0, -1), [
        "--force",
        "--deep",
        "--sign",
        "Developer ID Application: ACME (TEAMID)",
        "--options",
        "runtime",
        "--timestamp",
      ]);
      assert.match(codesign.args.at(-1) ?? "", /Demo\.app$/);
      assert.strictEqual(hdiutil.tool, "hdiutil");
    });

    it("signs ad-hoc without the hardened runtime", async function () {
      await dmg({
        appDir,
        appName: "Demo",
        arch: "x64",
        outDir: path.join(tmpDir, "out-adhoc"),
        signIdentity: "-",
        ...tools,
      });

      const [codesign] = await toolCalls();
      assert.deepStrictEqual(codesign.args.slice(0, -1), [
        "--force",
        "--deep",
        "--sign",
        "-",
      ]);
    });

    it("adds app-update.yml and writes the update archive and info file", async function () {
      const outDir = path.join(tmpDir, "out-publish");

      await dmg({
        appDir,
        appName: "Demo",
        arch: "arm64",
        outDir,
        version: "1.2.0",
        publish: { provider: "github", owner: "nwutils", repo: "demo" },
        signIdentity: "-",
        ...tools,
      });

      const calls = await toolCalls();
      /* app-update.yml is part of the signed bundle, so it is written before signing. */
      assert.deepStrictEqual(
        calls.map((call) => call.tool),
        ["codesign", "hdiutil", "ditto"],
      );
      const hdiutil = calls[1];
      assert.strictEqual(
        hdiutil.appUpdateYaml,
        'provider: "github"\nowner: "nwutils"\nrepo: "demo"\n',
      );

      const zipPath = path.join(outDir, "Demo-arm64-mac.zip");
      const ditto = calls[2];
      assert.deepStrictEqual(ditto.args.slice(0, 4), [
        "-c",
        "-k",
        "--sequesterRsrc",
        "--keepParent",
      ]);
      assert.match(ditto.args[4], /Demo\.app$/);
      assert.strictEqual(ditto.args[5], zipPath);

      const zip = await fs.promises.readFile(zipPath);
      const sha512 = crypto.createHash("sha512").update(zip).digest("base64");
      const updateInfo = await fs.promises.readFile(
        path.join(outDir, "latest-mac-arm64.yml"),
        "utf-8",
      );
      assert.ok(
        updateInfo.startsWith(
          [
            'version: "1.2.0"',
            "files:",
            '  - url: "Demo-arm64-mac.zip"',
            `    sha512: "${sha512}"`,
            `    size: ${zip.length}`,
            'path: "Demo-arm64-mac.zip"',
            `sha512: "${sha512}"`,
            "releaseDate: ",
          ].join("\n"),
        ),
      );
      assert.deepStrictEqual((await fs.promises.readdir(outDir)).sort(), [
        "Demo-arm64-mac.zip",
        "Demo-arm64.dmg",
        "latest-mac-arm64.yml",
      ]);
    });

    it("never modifies appDir", async function () {
      assert.deepStrictEqual(
        await fs.promises.readdir(
          path.join(appDir, "Demo.app", "Contents", "Resources"),
        ),
        [],
      );
    });
  },
);
