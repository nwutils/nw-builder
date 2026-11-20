import { equal } from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import selenium from "selenium-webdriver";

import { fileChooserPortal, launch } from "../../src/testing.js";

/*
 * Picking a folder in an `<input type="file" nwdirectory>` crashed NW.js
 * 0.117 and later (Chromium 154+) with
 *   FATAL:content/browser/web_contents/file_chooser_impl.cc:35]
 *   Check failed: !base_dir.empty().
 * The folder dialog is answered by a stand-in desktop portal, which needs a
 * headed NW.js: headless NW.js cancels file dialogs.
 */
describe("nwjs/nw.js#8393: picking a folder with nwdirectory", () => {
  /** @type {string} */
  let folder;
  /** @type {{ env: Record<string, string>, close: () => void } | undefined} */
  let portal = undefined;
  /** @type {selenium.WebDriver | undefined} */
  let driver = undefined;

  before(async () => {
    folder = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), "issue-8393-")),
      "picked",
    );
    fs.mkdirSync(folder);
    fs.writeFileSync(path.join(folder, "file.txt"), "inside the folder\n");
    portal = await fileChooserPortal([folder]);
    driver = await launch(path.join(import.meta.dirname, "app"), {
      headless: false,
      env: portal.env,
    });
  });

  it("selects the folder without crashing", { timeout: 60000 }, async () => {
    await driver?.findElement(selenium.By.id("choose")).click();
    const picked = await driver?.findElement(selenium.By.id("picked"));
    await driver?.wait(selenium.until.elementTextMatches(picked, /./), 30000);
    // The input holds the folder itself, not the files inside it.
    equal(await picked?.getText(), "picked");
  });

  after(async () => {
    await driver?.quit();
    portal?.close();
    fs.rmSync(path.dirname(folder), { recursive: true, force: true });
  });
});
