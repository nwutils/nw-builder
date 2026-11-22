import { doesNotMatch, match } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { launch, sdkDir } from "../../src/testing.js";

/* Chromium's placeholder, used when the credits aren't generated. */
const SAMPLE = /This is sample credits page/;

describe("nwjs/nw.js#8384: credits are missing", () => {
  /** @type {import("selenium-webdriver").WebDriver | undefined} */
  let driver = undefined;

  before(async () => {
    driver = await launch(path.join(import.meta.dirname, "app"));
  });

  it("ships the real credits.html", async () => {
    const credits = await fs.promises.readFile(
      path.join(sdkDir(), "credits.html"),
      "utf-8",
    );
    doesNotMatch(credits, SAMPLE);
    match(credits, /V8/);
    match(credits, /Node\.js/);
  });

  it("shows them at chrome://credits", { timeout: 30000 }, async () => {
    await driver?.get("chrome://credits/");
    const text = await driver?.executeScript("return document.body.innerText");
    doesNotMatch(String(text), SAMPLE);
    match(String(text), /V8/);
    match(String(text), /Node\.js/);
  });

  after(async () => {
    await driver?.quit();
  });
});
