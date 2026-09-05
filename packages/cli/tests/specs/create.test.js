import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, before, describe, it } from "node:test";

import { create } from "../../src/commands/create.js";

const BASE_DIR = "./tests/fixtures/create";

describe("create command", function () {

    before(function () {
        fs.mkdirSync(BASE_DIR, { recursive: true });
    });

    afterEach(function () {
        // clean everything after each test
        if (fs.existsSync(BASE_DIR)) {
            fs.rmSync(BASE_DIR, { recursive: true, force: true });
            fs.mkdirSync(BASE_DIR, { recursive: true });
            fs.rmSync(path.resolve("src", "templates", "broken-template"), { recursive: true, force: true });
        }
    });

    it("creates a new NW.js application using template", function () {
        create("demo", "vanilla-js", BASE_DIR);

        assert.strictEqual(
            fs.existsSync(path.join(BASE_DIR, "demo")),
            true
        );
    });

    it("throws if target directory already exists", function () {
        const target = path.join(BASE_DIR, "demo");
        fs.mkdirSync(target, { recursive: true });

        assert.throws(() => {
            create("demo", "vanilla-js", BASE_DIR);
        }, /already exists/i);
    });

    it("throws if template is not supported", function () {
        assert.throws(() => {
            create("demo", "unsupported-template", BASE_DIR);
        }, /not found|not supported/i);
    });

    it("updates package.json name field", function () {
        create("demo", "vanilla-js", BASE_DIR);

        const pkgPath = path.join(BASE_DIR, "demo", "package.json");
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

        assert.strictEqual(pkg.name, "demo");
    });

    it("replaces APP_NAME in index.html", function () {
        create("demo", "vanilla-js", BASE_DIR);

        const htmlPath = path.join(BASE_DIR, "demo", "index.html");
        const html = fs.readFileSync(htmlPath, "utf-8");

        assert.ok(html.includes("demo"));
        assert.ok(!html.includes("{{APP_NAME}}"));
    });

});
