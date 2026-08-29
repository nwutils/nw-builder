import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import decompress from "../../src/decompress.js";

/**
 * CRC-32, so the archives below are real zips rather than ones yauzl rejects
 * before the path is ever used.
 * @param  {Buffer} buf  - bytes to checksum
 * @returns {number}      - CRC-32 of `buf`
 */
function crc32(buf) {
  let crc = -1;
  for (const byte of buf) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ -1) >>> 0;
}

/**
 * Write a STORE-method zip containing `entries`, with no compression and no
 * data descriptors. Hand-rolled so the suite gains no dependency just to prove
 * a path-traversal guard.
 * @param  {string}                                              zipPath  - file to write
 * @param  {Array<{name: string, data: string, mode?: number}>}  entries  - archive members
 * @returns {void}
 */
function writeStoreZip(zipPath, entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.from(entry.data, "utf8");
    const sum = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8); /* stored */
    local.writeUInt32LE(sum, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    locals.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 10); /* stored */
    central.writeUInt32LE(sum, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    /* external attrs carry the unix mode in the high 16 bits */
    central.writeUInt32LE(((entry.mode ?? 0o100644) << 16) >>> 0, 38);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += 30 + name.length + data.length;
  }

  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  fs.writeFileSync(zipPath, Buffer.concat([...locals, centralBuf, end]));
}

describe("decompress refuses to write outside the destination", function () {
  /**
   * @returns {{root: string, cacheDir: string, outside: string}} - a fresh sandbox
   */
  function sandbox() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "getter-zip-slip-"));
    const cacheDir = path.join(root, "cache");
    fs.mkdirSync(cacheDir);
    return { root, cacheDir, outside: path.join(root, "outside.txt") };
  }

  /*
   * Entry NAMES are already refused by yauzl-promise itself, which throws
   * "Relative path: ../outside.txt" before this module sees the entry. These
   * two cases therefore lock in behaviour we inherit rather than behaviour we
   * added - worth keeping so a future zip backend swap cannot quietly drop it.
   */
  it("rejects an entry whose name escapes with ..", async function () {
    const { root, cacheDir, outside } = sandbox();
    const zipPath = path.join(root, "evil.zip");
    writeStoreZip(zipPath, [{ name: "../outside.txt", data: "pwned" }]);

    await assert.rejects(() => decompress(zipPath, cacheDir));
    assert.equal(
      fs.existsSync(outside),
      false,
      "a ../ entry must not be written outside cacheDir",
    );
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("rejects an absolute entry name", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "abs.zip");
    const absTarget = path.join(root, "abs-outside.txt");
    writeStoreZip(zipPath, [{ name: absTarget, data: "pwned" }]);

    await assert.rejects(() => decompress(zipPath, cacheDir));
    assert.equal(fs.existsSync(absTarget), false);
    fs.rmSync(root, { recursive: true, force: true });
  });

  /*
   * This is the case nothing was guarding. yauzl validates the entry name, so
   * `link` itself is fine - but the link TARGET is archive data too, and
   * fs.symlink writes it verbatim. The link lands inside cacheDir pointing out
   * of it, and anything later written through it escapes.
   */
  it("rejects a symlink whose target escapes", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "link.zip");
    writeStoreZip(zipPath, [
      { name: "link", data: "../outside.txt", mode: 0o120777 },
    ]);

    await assert.rejects(
      () => decompress(zipPath, cacheDir),
      /resolves outside the destination directory/,
    );
    assert.equal(fs.existsSync(path.join(cacheDir, "link")), false);
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("still extracts an ordinary entry", async function () {
    const { root, cacheDir } = sandbox();
    const zipPath = path.join(root, "ok.zip");
    writeStoreZip(zipPath, [{ name: "nested/file.txt", data: "hello" }]);

    await decompress(zipPath, cacheDir);
    assert.equal(
      fs.readFileSync(path.join(cacheDir, "nested", "file.txt"), "utf8"),
      "hello",
    );
    fs.rmSync(root, { recursive: true, force: true });
  });
});
