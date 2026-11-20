import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  argsGn,
  assertSupported,
  depsVar,
  gclientSpec,
  gypDefines,
  parseVersion,
  remainingMs,
  run,
  stepsLeft,
} from "../../../packages/build-tools/src/util.js";

describe("build-tools util", () => {
  it("reads pinned revisions from NW's DEPS", () => {
    const deps = `vars = {
  'nw_src_revision': '807bce6bcce7d8615e5155ab4e87ce7dc89461fd',
  "nw_node_revision": "49e4fcd01e589d9e51e0b4087b04416a373ee25e",
}`;
    assert.equal(
      depsVar(deps, "nw_src_revision"),
      "807bce6bcce7d8615e5155ab4e87ce7dc89461fd",
    );
    assert.equal(
      depsVar(deps, "nw_node_revision"),
      "49e4fcd01e589d9e51e0b4087b04416a373ee25e",
    );
    assert.equal(depsVar(deps, "nw_v8_revision"), undefined);
  });

  it("accepts only real NW.js versions", () => {
    assert.equal(parseVersion("0.120.0"), "0.120.0");
    assert.equal(parseVersion("v0.120.0"), "0.120.0");
    assert.equal(parseVersion("0.120.0-beta1"), "0.120.0-beta1");
    for (const bad of [
      "--upload-pack=touch /tmp/x",
      "0.120",
      "0.120.0 --x",
      "latest",
      "",
      "0.120.0-",
    ]) {
      assert.throws(() => parseVersion(bad), /Invalid NW.js version/, bad);
    }
  });

  it("builds the gclient spec NW's sync.py uses", () => {
    const spec = gclientSpec("abc123");
    assert.match(
      spec,
      /"url": "https:\/\/github.com\/nwjs\/chromium.src.git@abc123"/,
    );
    assert.match(spec, /"deps_file": "content\/nw\/DEPS"/);
    assert.match(spec, /"managed": False/);
  });

  it("writes GN args for each flavor", () => {
    const normal = argsGn({ arch: "x64", flavor: "normal" });
    assert.match(normal, /^is_debug = false$/m);
    assert.match(normal, /^is_component_ffmpeg = true$/m);
    assert.match(normal, /^target_cpu = "x64"$/m);
    assert.match(normal, /^nwjs_sdk = false$/m);
    assert.match(normal, /^symbol_level = 0$/m);
    assert.doesNotMatch(normal, /cc_wrapper/);
    const sdk = argsGn({ arch: "x64", flavor: "sdk", ccWrapper: "sccache" });
    assert.match(sdk, /^nwjs_sdk = true$/m);
    assert.match(sdk, /^cc_wrapper = "sccache"$/m);
  });

  it("matches the Node.js GYP defines to the flavor", () => {
    assert.match(
      gypDefines({ arch: "x64", flavor: "normal" }),
      /(^| )nwjs_sdk=0( |$)/,
    );
    assert.match(
      gypDefines({ arch: "x64", flavor: "sdk" }),
      /(^| )nwjs_sdk=1( |$)/,
    );
    assert.match(
      gypDefines({ arch: "x64", flavor: "sdk" }),
      /(^| )building_nw=1( |$)/,
    );
  });

  it("counts the steps ninja has left", () => {
    assert.equal(
      stepsLeft("ninja: Entering directory `out/nw'\nninja: no work to do.\n"),
      0,
    );
    assert.equal(
      stepsLeft("[1/52310] CXX obj/a.o\n[2/52310] CXX obj/b.o\n"),
      52310,
    );
    assert.equal(stepsLeft(""), 0);
  });

  it("computes the time left before a deadline", () => {
    assert.equal(remainingMs(undefined), Infinity);
    assert.equal(remainingMs(10_000, 4_000), 6_000);
    assert.equal(remainingMs(1_000, 4_000), 0);
  });

  it("only allows Linux x64 for now", () => {
    assert.doesNotThrow(() => assertSupported("linux", "x64"));
    assert.throws(
      () => assertSupported("darwin", "arm64"),
      /not supported yet/,
    );
    assert.throws(() => assertSupported("linux", "arm64"), /not supported yet/);
  });

  it(
    "stops a command at the deadline",
    { skip: process.platform === "win32" },
    async () => {
      const started = Date.now();
      const result = await run("sleep", ["30"], {
        cwd: ".",
        env: process.env,
        stopAt: Date.now() + 300,
      });
      assert.equal(result, "stopped");
      assert.ok(Date.now() - started < 10_000);
    },
  );

  it(
    "finishes a command before the deadline",
    { skip: process.platform === "win32" },
    async () => {
      assert.equal(
        await run("true", [], {
          cwd: ".",
          env: process.env,
          stopAt: Date.now() + 60_000,
        }),
        "done",
      );
      await assert.rejects(
        run("false", [], { cwd: ".", env: process.env }),
        /exit code 1/,
      );
    },
  );

  it("skips a command once the deadline has passed", async () => {
    assert.equal(
      await run("node", ["-e", "process.exit(1)"], {
        cwd: ".",
        env: process.env,
        stopAt: 1,
      }),
      "stopped",
    );
  });
});
