import { cwd } from "node:process";

import { parse } from "./parse.js";

test("no options passed", () => {
  expect(parse({})).resolves.toStrictEqual({
    srcDir: undefined,
    version: undefined,
    flavour: undefined,
    platform: undefined,
    arch: undefined,
    outDir: undefined,
    cache: true,
    cacheDir: `${cwd()}/cache`,
    downloadUrl: "https://dl.nwjs.io",
    manifestUrl: "https://nwjs.io/versions",
    zip: false,
  });
});
