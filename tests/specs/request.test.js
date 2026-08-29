import assert from "node:assert";
import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import request from "../../src/request.js";
import testServer from "../fixtures/request.js";

describe("request test suite", function () {
  before(async function () {
    fs.rmSync(path.resolve("./tests/fixtures/cache/"), {
      recursive: true,
      force: true,
    });
    await new Promise((resolve, reject) => {
      testServer.on("error", reject);
      testServer.listen(8080, resolve);
    });
    console.log("[ DEBUG ] Starting test server for request tests...");
  });

  it("downloads a file from a test server", async function () {
    const filePath = path.resolve("./tests/fixtures/cache/test.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await request("http://localhost:8080/request_test.txt", filePath);

    assert.ok(fs.existsSync(filePath), "File should exist after download");
  });

  it("deletes partially downloaded file on SIGINT (Ctrl + C)", async function () {
    const filePath = path.resolve("./tests/fixtures/cache/partial.txt");

    const child = child_process.spawn("node", ["./tests/fixtures/sigint.js"], {
      stdio: "ignore", // no logs needed
    });

    child.kill("SIGINT");

    await new Promise((resolve) => child.on("exit", resolve));

    assert.strictEqual(
      fs.existsSync(filePath),
      false,
      "Partial file should be deleted on SIGINT",
    );
  });

  it("rejects with error when status code is not 200", async function () {
    const filePath = path.resolve("./tests/fixtures/cache/nonexistent.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await assert.rejects(
      async () => {
        await request("http://localhost:8080/nonexistent.txt", filePath);
      },
      {
        name: "Error",
        message: "Request failed. Status code: 404",
      },
    );
  });

  it("rejects with error when write stream fails", async function () {
    // Try to write to an existing directory instead of a file
    const filePath = path.resolve("./tests/fixtures/cache");

    await assert.rejects(
      async () => {
        await request("http://localhost:8080/request_test.txt", filePath);
      },
      {
        code: "EISDIR",
      },
    );
  });

  it("rejects with error when response stream fails", async function () {
    const filePath = path.resolve("./tests/fixtures/cache/response_error.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await assert.rejects(
      async () => {
        await request("http://localhost:8080/error", filePath);
      },
      {
        name: "Error",
      },
    );
  });

  it("follows redirect and downloads file", async function () {
    const filePath = path.resolve("./tests/fixtures/cache/redirected.txt");

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await request("http://localhost:8080/redirect", filePath);

    assert.ok(fs.existsSync(filePath), "File should exist after redirect");
  });

  after(async function () {
    await new Promise((resolve) => testServer.close(resolve));
    console.log("[ DEBUG ] Stopping test server for request tests...");
  });
});
