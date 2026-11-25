import { deepEqual, ok } from "node:assert";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { launch, waylandIconSession } from "../../src/testing.js";

/*
 * On Wayland, a window.icon larger than 128px showed the default icon:
 * Chromium's Wayland window only sent the icon images that already existed,
 * and window icons are drawn lazily (NW.js's 128px resize, and the app icons
 * Chromium sets after it), so they arrived with no images. The test runs
 * NW.js on a headless Wayland session that records the window icon requests
 * (the reporter's WAYLAND_DEBUG check, automated).
 */
describe("nwjs/nw.js#8397: window.icon larger than 128px on Wayland", () => {
  /** @type {Awaited<ReturnType<typeof waylandIconSession>> | undefined} */
  let session = undefined;
  /** @type {import("selenium-webdriver").WebDriver | undefined} */
  let driver = undefined;

  before(async () => {
    session = await waylandIconSession();
    driver = await launch(path.join(import.meta.dirname, "app"), {
      headless: false,
      args: session.args,
      env: session.env,
    });
  });

  it("sets every window icon with its image", { timeout: 60000 }, async () => {
    const requests = /** @type {NonNullable<typeof session>} */ (session)
      .requests;
    const iconsSet = () =>
      requests.filter((r) => r.request === "set_icon" && r.icon !== 0);
    /* Wait for the first icon, then a few seconds for any later ones. */
    const deadline = Date.now() + 30000;
    while (iconsSet().length === 0 && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));

    ok(iconsSet().length > 0, "NW.js never set a window icon");
    const log = JSON.stringify(requests);
    /* Ids are reused once freed: pair each icon with its own create_icon. */
    /** @type {Map<number, object[]>} */
    const images = new Map();
    let first = true;
    for (const r of requests) {
      if (r.request === "create_icon") {
        images.set(r.icon, []);
      } else if (r.request === "add_buffer") {
        images.get(r.icon)?.push({
          width: r.width,
          height: r.height,
          scale: r.scale,
        });
      } else if (r.icon !== 0) {
        ok(images.get(r.icon)?.length, `A window icon was set empty: ${log}`);
        if (first) {
          /* The window.icon, which NW.js resizes to 128px. */
          deepEqual(
            images.get(r.icon)?.[0],
            { width: 128, height: 128, scale: 1 },
            `The window.icon wasn't set at 128px: ${log}`,
          );
          first = false;
        }
      }
    }
  });

  after(async () => {
    await driver?.quit();
    session?.close();
  });
});
