import { run } from "./dist/index.cjs";

run(
  "0.67.0",
  "sdk",
  "linux",
  "x64",
  "https://dl.nwjs.io/",
  "./test/demo",
  "./test/demo/cache",
);
