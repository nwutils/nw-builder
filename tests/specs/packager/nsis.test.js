import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import nsis, {
  listAppFiles,
  nsisScript,
} from "../../../packages/packager/src/nsis.js";

const fakeMakensis = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "fixtures",
  "packager",
  "bin",
  "fake-makensis.cjs",
);

const hasMakensis =
  child_process.spawnSync("makensis", ["-VERSION"]).error === undefined;

describe("packager/nsis", function () {
  let tmpDir;
  let appDir;
  let iconPath;
  let licensePath;

  before(async function () {
    tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "nwutils-packager-nsis-test-"),
    );

    /* A stand-in for a Windows build from `@nwutils/builder`. */
    appDir = path.join(tmpDir, "app");
    await fs.promises.mkdir(path.join(appDir, "locales", "extra"), {
      recursive: true,
    });
    await fs.promises.mkdir(path.join(appDir, "empty"));
    await fs.promises.writeFile(path.join(appDir, "Demo.exe"), "MZ");
    await fs.promises.writeFile(path.join(appDir, "resources.pak"), "pak");
    await fs.promises.writeFile(
      path.join(appDir, "locales", "en-US.pak"),
      "en",
    );
    await fs.promises.writeFile(
      path.join(appDir, "locales", "extra", "a$b.pak"),
      "ab",
    );

    iconPath = path.join(tmpDir, "icon.ico");
    await fs.promises.writeFile(iconPath, "");
    licensePath = path.join(tmpDir, "LICENSE.txt");
    await fs.promises.writeFile(licensePath, "MIT\n");

    await fs.promises.chmod(fakeMakensis, 0o755);
  });

  after(async function () {
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  });

  describe("validation", function () {
    it("throws when appDir does not exist", async function () {
      await assert.rejects(
        nsis({
          appDir: path.join(tmpDir, "nope"),
          appName: "Demo",
          version: "1.0.0",
        }),
        /does not exist/,
      );
    });

    it("throws when appName is not a valid Windows file name", async function () {
      for (const appName of ["", "a/b", "a\\b", "CON", "Demo."]) {
        await assert.rejects(
          nsis({ appDir, appName, version: "1.0.0" }),
          /Expected "options.appName" to be a valid Windows file name/,
        );
      }
    });

    it("throws when version is missing", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: /** @type {string} */ (/** @type {unknown} */ (undefined)),
        }),
        /Expected "options.version" to be a non-empty string/,
      );
    });

    it("throws when version doesn't start with a number", async function () {
      await assert.rejects(
        nsis({ appDir, appName: "Demo", version: "latest" }),
        /starting with a number/,
      );
    });

    it("throws on an unsupported architecture", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          arch: /** @type {"x64"} */ (/** @type {unknown} */ ("mips")),
        }),
        /Expected "options.arch" to be "ia32", "x64" or "arm64"/,
      );
    });

    it("throws when appId contains a backslash", async function () {
      await assert.rejects(
        nsis({ appDir, appName: "Demo", version: "1.0.0", appId: "a\\b" }),
        /Expected "options.appId" to be a non-empty string without "\\"/,
      );
    });

    it("throws when the icon is not a .ico file", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          icon: path.join(tmpDir, "icon.png"),
        }),
        /Expected "options.icon" to be a .ico file/,
      );
    });

    it("throws when the icon does not exist", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          icon: path.join(tmpDir, "missing.ico"),
        }),
        /"options.icon" does not exist/,
      );
    });

    it("throws when the license is not a .txt or .rtf file", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          license: path.join(tmpDir, "LICENSE.md"),
        }),
        /Expected "options.license" to be a .txt or .rtf file/,
      );
    });

    it("throws when a shortcut option is not a boolean", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          desktopShortcut: /** @type {boolean} */ (
            /** @type {unknown} */ ("no")
          ),
        }),
        /Expected "options.desktopShortcut" to be a boolean/,
      );
    });

    it("throws when the app's executable is missing", async function () {
      await assert.rejects(
        nsis({ appDir, appName: "NotDemo", version: "1.0.0" }),
        /Expected the NW.js executable to exist/,
      );
    });

    it("explains how to install NSIS when makensis is missing", async function () {
      await assert.rejects(
        nsis({
          appDir,
          appName: "Demo",
          version: "1.0.0",
          outDir: path.join(tmpDir, "out-missing"),
          makensisPath: path.join(tmpDir, "no-such-makensis"),
        }),
        /Could not find the NSIS compiler/,
      );
    });
  });

  describe("listAppFiles", function () {
    it("lists files and directories, parents before children", async function () {
      const appFiles = await listAppFiles(appDir);
      assert.deepStrictEqual(appFiles.files, [
        "Demo.exe",
        path.join("locales", "en-US.pak"),
        path.join("locales", "extra", "a$b.pak"),
        "resources.pak",
      ]);
      assert.deepStrictEqual(appFiles.dirs, [
        "empty",
        "locales",
        path.join("locales", "extra"),
      ]);
      assert.strictEqual(appFiles.size, 2 + 3 + 2 + 2);
    });
  });

  describe("nsisScript", function () {
    /**
     * @param {Partial<Parameters<typeof nsisScript>[0]>} overrides
     * @returns {Promise<string>}
     */
    async function script(overrides = {}) {
      return nsisScript({
        appDir,
        appFiles: await listAppFiles(appDir),
        appName: "Demo",
        appId: "Demo",
        version: "1.2.3-beta.1",
        fileVersion: "1.2.3.0",
        arch: "x64",
        installerPath: path.join(tmpDir, "Demo-x64-Setup.exe"),
        copyright: "",
        desktopShortcut: true,
        startMenuShortcut: true,
        ...overrides,
      });
    }

    it("installs for the current user without elevation", async function () {
      const contents = await script();
      assert.match(contents, /^RequestExecutionLevel user$/m);
      assert.match(contents, /^InstallDir "\$LOCALAPPDATA\\Programs\\Demo"$/m);
      assert.doesNotMatch(contents, /HKLM/);
    });

    it("copies every file into its directory", async function () {
      const contents = await script();
      assert.match(
        contents,
        new RegExp(
          [
            '  SetOutPath "\\$INSTDIR"',
            `  File "${escapeRegExp(path.join(appDir, "Demo.exe"))}"`,
            `  File "${escapeRegExp(path.join(appDir, "resources.pak"))}"`,
            '  SetOutPath "\\$INSTDIR\\\\empty"',
            '  SetOutPath "\\$INSTDIR\\\\locales"',
            `  File "${escapeRegExp(path.join(appDir, "locales", "en-US.pak"))}"`,
            '  SetOutPath "\\$INSTDIR\\\\locales\\\\extra"',
            `  File "${escapeRegExp(path.join(appDir, "locales", "extra", "a$b.pak"))}"`,
          ].join("\n"),
        ),
      );
    });

    it("uninstalls exactly the installed files, without recursive deletes", async function () {
      const contents = await script();
      const uninstall = contents.slice(contents.indexOf('Section "Uninstall"'));
      for (const line of [
        '  Delete "$INSTDIR\\Demo.exe"',
        '  Delete "$INSTDIR\\locales\\en-US.pak"',
        /* `$` is doubled in runtime strings, so it isn't read as a variable. */
        '  Delete "$INSTDIR\\locales\\extra\\a$$b.pak"',
        '  Delete "$INSTDIR\\resources.pak"',
        '  Delete "$INSTDIR\\Uninstall.exe"',
      ]) {
        assert.ok(uninstall.includes(`${line}\n`), line);
      }
      assert.ok(
        uninstall.includes(
          [
            '  RMDir "$INSTDIR\\locales\\extra"',
            '  RMDir "$INSTDIR\\locales"',
            '  RMDir "$INSTDIR\\empty"',
          ].join("\n"),
        ),
      );
      assert.doesNotMatch(contents, /RMDir \/r/);
    });

    it("registers the app in the installed apps list", async function () {
      const contents = await script({
        publisher: "ACME",
        copyright: "(c) ACME",
      });
      const key =
        '"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Demo"';
      for (const line of [
        `WriteRegStr HKCU ${key} "DisplayName" "Demo"`,
        `WriteRegStr HKCU ${key} "DisplayVersion" "1.2.3-beta.1"`,
        `WriteRegStr HKCU ${key} "Publisher" "ACME"`,
        `WriteRegStr HKCU ${key} "UninstallString" '"$INSTDIR\\Uninstall.exe"'`,
        `WriteRegDWORD HKCU ${key} "EstimatedSize" 1`,
        'VIProductVersion "1.2.3.0"',
        'VIAddVersionKey "LegalCopyright" "(c) ACME"',
      ]) {
        assert.ok(contents.includes(line), line);
      }
    });

    it("records the installation under appId", async function () {
      const contents = await script({ appId: "com.example.demo" });
      assert.ok(
        contents.includes(
          'DeleteRegKey HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\com.example.demo"',
        ),
      );
    });

    it("escapes values written at install time", async function () {
      const contents = await script({ publisher: 'A "$B"' });
      assert.ok(contents.includes('"Publisher" "A $\\"$$B$\\""'));
    });

    it("creates shortcuts only when enabled", async function () {
      const withShortcuts = await script();
      assert.ok(
        withShortcuts.includes('CreateShortcut "$SMPROGRAMS\\Demo.lnk"'),
      );
      assert.ok(withShortcuts.includes('CreateShortcut "$DESKTOP\\Demo.lnk"'));

      const withoutShortcuts = await script({
        desktopShortcut: false,
        startMenuShortcut: false,
      });
      assert.doesNotMatch(withoutShortcuts, /CreateShortcut/);
    });

    it("adds icon and license pages only when given", async function () {
      const plain = await script();
      assert.doesNotMatch(plain, /MUI_ICON|MUI_PAGE_LICENSE/);

      const withExtras = await script({ iconPath, licensePath });
      assert.ok(withExtras.includes(`!define MUI_ICON "${iconPath}"`));
      assert.ok(
        withExtras.includes(`!insertmacro MUI_PAGE_LICENSE "${licensePath}"`),
      );
    });

    it("refuses to run on machines that can't run the build", async function () {
      assert.ok(
        (await script({ arch: "arm64" })).includes(
          ["  ${If} ${IsNativeARM64}", "  ${Else}"].join("\n"),
        ),
      );
      /* x64 builds only run emulated on ARM64 from Windows 11. */
      assert.ok(
        (await script({ arch: "x64" })).includes(
          [
            "  ${If} ${IsNativeAMD64}",
            "  ${ElseIf} ${IsNativeARM64}",
            "  ${AndIf} ${AtLeastWin11}",
            "  ${Else}",
          ].join("\n"),
        ),
      );
      assert.doesNotMatch(await script({ arch: "ia32" }), /IsNative/);
    });

    it("waits for the app to close before replacing or deleting it", async function () {
      const contents = await script();
      const install = contents.slice(
        contents.indexOf('Section "Install"'),
        contents.indexOf("SectionEnd"),
      );
      const uninstall = contents.slice(contents.indexOf('Section "Uninstall"'));
      const check = (/** @type {string} */ exe) => `FileOpen $2 "${exe}" a`;

      /* Both the previous install location and the new one are checked, before the old uninstaller runs. */
      assert.ok(
        install.indexOf(check("$0\\Demo.exe")) <
          install.indexOf(check("$INSTDIR\\Demo.exe")),
      );
      assert.ok(
        install.indexOf(check("$INSTDIR\\Demo.exe")) <
          install.indexOf("ExecWait"),
      );
      assert.ok(
        uninstall.indexOf(check("$INSTDIR\\Demo.exe")) <
          uninstall.indexOf("Delete"),
      );
      assert.match(
        contents,
        /MessageBox MB_RETRYCANCEL\|MB_ICONEXCLAMATION "Close Demo, then select Retry\." \/SD IDCANCEL IDCANCEL/,
      );
    });

    it("aborts when the previous version fails to uninstall", async function () {
      const contents = await script();
      assert.ok(
        contents.includes(
          [
            "    ClearErrors",
            `    ExecWait '"$0\\Uninstall.exe" /S _?=$0' $1`,
            "    ${If} ${Errors}",
            "    ${OrIf} $1 != 0",
          ].join("\n"),
        ),
      );
    });
  });

  it(
    "generates a script and invokes makensis",
    { skip: process.platform === "win32" },
    async function () {
      const outDir = path.join(tmpDir, "out-fake");

      const installerPath = await nsis({
        appDir,
        appName: "Demo",
        version: "1.0.0",
        arch: "arm64",
        outDir,
        icon: iconPath,
        license: licensePath,
        makensisPath: fakeMakensis,
      });

      assert.strictEqual(
        installerPath,
        path.join(outDir, "Demo-arm64-Setup.exe"),
      );
      assert.strictEqual(
        await fs.promises.readFile(installerPath, "utf-8"),
        "fake installer\n",
      );
      const contents = await fs.promises.readFile(
        `${installerPath}.nsi`,
        "utf-8",
      );
      assert.ok(contents.includes('VIProductVersion "1.0.0.0"'));
      assert.ok(contents.includes(`!define MUI_ICON "${iconPath}"`));
    },
  );

  it(
    "builds a real installer with makensis",
    { skip: hasMakensis === false && "makensis is not installed" },
    async function () {
      const outDir = path.join(tmpDir, "out-real");

      const installerPath = await nsis({
        appDir,
        appName: "Demo",
        version: "1.0.0",
        arch: "x64",
        outDir,
        license: licensePath,
        publisher: "ACME",
      });

      const magic = await fs.promises.readFile(installerPath);
      assert.strictEqual(magic.subarray(0, 2).toString(), "MZ");
    },
  );
});

/**
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
