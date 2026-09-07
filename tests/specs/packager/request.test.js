import assert from "node:assert";
import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import request from "../../../packages/packager/src/request.js";
import testServer from "../../fixtures/packager/request.js";

const fixturesDir = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "fixtures",
  "packager",
);
const cacheDir = path.join(fixturesDir, "cache");

describe("packager/request test suite", function () {
  before(async function () {
    fs.rmSync(cacheDir, {
      recursive: true,
      force: true,
    });
    await new Promise((resolve, reject) => {
      testServer.on("error", reject);
      testServer.listen(8090, resolve);
    });
  });

  it("downloads a file from a test server", async function () {
    const filePath = path.join(cacheDir, "test.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await request("http://localhost:8090/request_test.txt", filePath);

    assert.ok(fs.existsSync(filePath), "File should exist after download");
  });

  it("deletes partially downloaded file on SIGINT (Ctrl + C)", async function () {
    const filePath = path.join(cacheDir, "partial.txt");

    const child = child_process.spawn(
      "node",
      [path.join(fixturesDir, "sigint.js")],
      {
        cwd: fixturesDir,
        stdio: "ignore", // no logs needed
      },
    );

    child.kill("SIGINT");

    await new Promise((resolve) => child.on("exit", resolve));

    assert.strictEqual(
      fs.existsSync(filePath),
      false,
      "Partial file should be deleted on SIGINT",
    );
  });

  it("rejects with error when status code is not 200", async function () {
    const filePath = path.join(cacheDir, "nonexistent.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await assert.rejects(
      async () => {
        await request("http://localhost:8090/nonexistent.txt", filePath);
      },
      {
        name: "Error",
        message: "Request failed. Status code: 404",
      },
    );
  });

  it("follows redirect and downloads file", async function () {
    const filePath = path.join(cacheDir, "redirected.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await request("http://localhost:8090/redirect", filePath);

    assert.ok(fs.existsSync(filePath), "File should exist after redirect");
  });

  it("rejects after too many redirects", async function () {
    const filePath = path.join(cacheDir, "redirect-loop.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await assert.rejects(
      request("http://localhost:8090/redirect-loop", filePath),
      /Too many redirects/,
    );
  });

  after(async function () {
    await new Promise((resolve) => testServer.close(resolve));
    fs.rmSync(cacheDir, {
      recursive: true,
      force: true,
    });
  });
});
