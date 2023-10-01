import { rename } from "node:fs/promises";
import { resolve } from "node:path";

await rename(
  resolve(
    "test",
    "fixture",
    "out",
    "nwapp.app",
    "Contents",
    "Frameworks",
    "nwjs Framework.framework",
    "Helpers",
    `nwjs Helper (Alerts).app`,
  ),
  resolve(
    "test",
    "fixture",
    "out",
    "nwapp.app",
    "Contents",
    "Frameworks",
    "nwjs Framework.framework",
    "Helpers",
    `nwapp Helper (Alerts).app`,
  ),
);
