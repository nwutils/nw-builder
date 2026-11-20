import assert from "node:assert/strict";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  applyPatches,
  DEFAULT_ISSUES,
  test as runIssueTests,
} from "../../../packages/build-tools/src/main.js";
import {
  listIssues,
  listPatches,
  selectSdkAsset,
} from "../../../packages/build-tools/src/util.js";

/**
 * Creates an empty temporary directory.
 *
 * @returns {string} Its path.
 */
function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "build-tools-"));
}

/**
 * Writes files under a directory, creating folders as needed.
 *
 * @param {string} root - Base directory.
 * @param {Record<string, string>} files - Relative path to contents.
 * @returns {void}
 */
function write(root, files) {
  for (const [file, contents] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), contents);
  }
}

describe("build-tools issues", () => {
  it("lists issues, skipping the template", () => {
    const dir = tempDir();
    write(dir, {
      "_template/x": "",
      "8345/x": "",
      "1234/x": "",
      ".hidden/x": "",
    });
    assert.deepEqual(listIssues(dir), ["1234", "8345"]);
  });

  it("lists patches by issue, then repository, then file name", () => {
    const dir = tempDir();
    write(dir, {
      "8345/patches/nw.js/0001-later-issue.patch": "",
      "1234/patches/v8/0001-v8.patch": "",
      "1234/patches/nw.js/0002-b.patch": "",
      "1234/patches/nw.js/0001-a.patch": "",
      "1234/patches/nw.js/notes.md": "",
      "1234/patches/chromium.src/0001-c.patch": "",
      "_template/patches/nw.js/0001-ignored.patch": "",
    });
    assert.deepEqual(
      listPatches(dir).map(
        (p) =>
          `${p.issue} ${p.project}/${path.basename(p.file)} -> ${p.target}`,
      ),
      [
        "1234 nw.js/0001-a.patch -> src/content/nw",
        "1234 nw.js/0002-b.patch -> src/content/nw",
        "1234 chromium.src/0001-c.patch -> src",
        "1234 v8/0001-v8.patch -> src/v8",
        "8345 nw.js/0001-later-issue.patch -> src/content/nw",
      ],
    );
  });

  it("rejects patch folders that aren't nwjs repositories", () => {
    const dir = tempDir();
    write(dir, { "1234/patches/chromium/0001-x.patch": "" });
    assert.throws(
      () => listPatches(dir),
      /Unknown patch folder "1234\/patches\/chromium"/,
    );
  });

  it("ships only the template, with no patches", () => {
    assert.deepEqual(listIssues(DEFAULT_ISSUES), []);
    assert.deepEqual(listPatches(DEFAULT_ISSUES), []);
    assert.ok(
      fs.existsSync(path.join(DEFAULT_ISSUES, "_template", "issue.test.js")),
    );
  });

  it("applies an issue's patches in the checkout of their repository", () => {
    const root = tempDir();
    const nw = path.join(root, "src", "content", "nw");
    fs.mkdirSync(nw, { recursive: true });
    const git = (/** @type {string[]} */ ...args) =>
      child_process.execFileSync("git", args, { cwd: nw, encoding: "utf8" });
    git("init", "-q");
    fs.writeFileSync(path.join(nw, "a.txt"), "upstream\n");
    git("add", "a.txt");
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "base");
    // A patch as made in a clone of nw.js.
    fs.writeFileSync(path.join(nw, "a.txt"), "fixed\n");
    const patch = git("diff");
    git("checkout", "--", "a.txt");

    const issues = tempDir();
    write(issues, { "1234/patches/nw.js/0001-fix.patch": patch });
    applyPatches(root, issues);
    assert.equal(fs.readFileSync(path.join(nw, "a.txt"), "utf8"), "fixed\n");

    // Applying it again fails with the patch's name, as after an update.
    assert.throws(
      () => applyPatches(root, issues),
      /1234\/patches\/nw.js\/0001-fix.patch does not apply to src\/content\/nw/,
    );
  });
});

describe("build-tools issue tests", () => {
  const asset = (/** @type {string} */ name) => ({
    name,
    browser_download_url: `https://example.com/${name}`,
  });

  it("downloads the SDK package from a release", () => {
    const sdk = selectSdkAsset([
      asset("nwjs-sdk-v0.120.0-linux-x64.tar.gz.sha256.txt"),
      asset("nwjs-v0.120.0-linux-x64.tar.gz"),
      asset("nwjs-sdk-v0.120.0-linux-x64.tar.gz"),
    ]);
    assert.equal(sdk.name, "nwjs-sdk-v0.120.0-linux-x64.tar.gz");
  });

  it("needs the SDK, since the tests drive NW.js with chromedriver", () => {
    assert.throws(
      () => selectSdkAsset([asset("nwjs-v0.120.0-linux-x64.tar.gz")]),
      /needs the Linux x64 SDK package/,
    );
  });

  it("runs only the chosen issue's test, with the SDK in NWJS_SDK_DIR", async () => {
    const dir = tempDir();
    const issues = tempDir();
    const record = path.join(dir, "ran.txt");
    const issueTest = (
      /** @type {string} */ name,
      /** @type {boolean} */ pass,
    ) =>
      [
        'import fs from "node:fs";',
        'import { it } from "node:test";',
        `it("${name}", () => {`,
        `  fs.appendFileSync(${JSON.stringify(record)}, "${name} " + process.env.NWJS_SDK_DIR + "\\n");`,
        pass ? "});" : '  throw new Error("still broken");\n});',
      ].join("\n");
    write(issues, {
      "1234/issue.test.js": issueTest("1234", true),
      "8345/issue.test.js": issueTest("8345", false),
    });
    const nwdir = path.join(dir, "sdk");

    assert.equal(
      await runIssueTests({ dir, issues, issue: "1234", nwdir }),
      true,
    );
    assert.equal(fs.readFileSync(record, "utf8"), `1234 ${nwdir}\n`);

    assert.equal(
      await runIssueTests({ dir, issues, issue: "8345", nwdir }),
      false,
    );
  });

  it("fails clearly for an unknown issue or one without a test", async () => {
    const issues = tempDir();
    write(issues, { "1234/app/index.html": "" });
    await assert.rejects(
      runIssueTests({ dir: tempDir(), issues, issue: "9999", nwdir: "/x" }),
      /No issue folder/,
    );
    await assert.rejects(
      runIssueTests({ dir: tempDir(), issues, issue: "1234", nwdir: "/x" }),
      /has no \*\.test\.js/,
    );
    await assert.rejects(
      runIssueTests({ dir: tempDir(), issues, issue: "../etc", nwdir: "/x" }),
      /Invalid issue name/,
    );
  });
});
