const fs = require("node:fs");
const { resolve } = require("node:path");

const NwBuilder = require("./lib/index.cjs");

const nw = new NwBuilder({
  files: ["package.json", "test/demo/*"],
  platforms: ["linux64", "osx64", "win64"],
  version: "0.67.1",
});

nw.run().then(() => {
  let NW_manifest = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf8" }),
  );

  NW_manifest.main = "test/demo/index.html";

  const manifestPath = resolve(
    "build",
    "nw-builder",
    "win64",
    "package.nw",
    "package.json",
  );
  const manifestData = JSON.stringify(NW_manifest);

  fs.writeFileSync(manifestPath, manifestData, { encoding: "utf8" });
});
