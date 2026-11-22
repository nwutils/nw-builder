import { describe, it } from "node:test";

/*
 * The assessment session only starts in a MacOS app signed with the
 * com.apple.developer.automatic-assessment-configuration entitlement, and
 * the check needs a system-wide key press, so this can't run in CI. To check
 * by hand: sign app/ with the entitlement, start it, wait for "ASSESSMENT MODE
 * ENABLED" in the log, press Ctrl+Shift+A and see "hotkey fired".
 */
describe("nwjs/nw.js#8358: global hotkeys stop after kiosk mode on MacOS", () => {
  it(
    "keeps global hotkeys working once the assessment session begins",
    { skip: "needs an Apple-signed MacOS app with the assessment entitlement" },
    () => {},
  );
});
