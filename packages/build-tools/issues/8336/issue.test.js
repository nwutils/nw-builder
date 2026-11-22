import { equal, notEqual } from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import selenium from "selenium-webdriver";

import { fileChooserPortal, launch } from "../../src/testing.js";

/*
 * showSaveFilePicker() titled the save dialog "Warning: this site can see
 * edits you make". The dialog is answered by a stand-in desktop portal, which
 * records its title and needs a headed NW.js.
 */
describe("nwjs/nw.js#8336: scary save file picker title", () => {
  /** @type {string} */
  let file;
  /** @type {Awaited<ReturnType<typeof fileChooserPortal>> | undefined} */
  let portal = undefined;
  /** @type {selenium.WebDriver | undefined} */
  let driver = undefined;

  before(async () => {
    file = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), "issue-8336-")),
      "saved.txt",
    );
    portal = await fileChooserPortal([file]);
    driver = await launch(path.join(import.meta.dirname, "app"), {
      headless: false,
      env: portal.env,
    });
  });

  it(
    "doesn't warn in the save dialog's title",
    { timeout: 60000 },
    async () => {
      await driver?.findElement(selenium.By.id("save")).click();
      const saved = await driver?.findElement(selenium.By.id("saved"));
      await driver?.wait(selenium.until.elementTextMatches(saved, /./), 30000);
      equal(await saved?.getText(), "saved.txt");

      const dialog = portal?.dialogs.find(
        ({ method }) => method === "SaveFile",
      );
      notEqual(dialog, undefined);
      notEqual(dialog?.title, "Warning: this site can see edits you make");
    },
  );

  after(async () => {
    await driver?.quit();
    portal?.close();
    fs.rmSync(path.dirname(file), { recursive: true, force: true });
  });
});
