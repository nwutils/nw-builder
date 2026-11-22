import { equal, match } from "node:assert";
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { after, before, describe, it } from "node:test";

import { sdkDir } from "../../src/testing.js";

describe("nwjs/nw.js#8392: --headless crashes without --user-data-dir", () => {
  let configHome = "";

  /* Headless makes its profile under $XDG_CONFIG_HOME/<app name>-headless. */
  before(async () => {
    configHome = await fs.promises.mkdtemp(path.join(os.tmpdir(), "nw-8392-"));
  });

  it("runs the app headless", { timeout: 60000 }, async () => {
    const result = child_process.spawnSync(
      path.join(sdkDir(), "nw"),
      [
        path.join(import.meta.dirname, "app"),
        "--headless=new",
        "--no-sandbox",
        "--enable-logging=stderr",
      ],
      {
        encoding: "utf-8",
        timeout: 50000,
        env: { ...process.env, XDG_CONFIG_HOME: configHome },
      },
    );
    equal(result.signal, null, result.stderr);
    equal(result.status, 0, result.stderr);
    match(result.stderr, /"started"/);
  });

  after(async () => {
    await fs.promises.rm(configHome, { recursive: true, force: true });
  });
});
