const NwBuilder = require("../../lib/index.cjs");

const nw = new NwBuilder({
  version: "0.64.1",
  files: "./**",
  macIcns: "./icon.icns",
  macPlist: { mac_bundle_id: "myPkg" },
});

nw.on("log", (msg) => console.log("nw-builder", msg));

nw.on("appstart", (msg) => {
  console.log("nw-builder", msg)
  process.exit(0);
})

nw.run()
  .then(() => console.log("nw-builder Closing app via user action"))
  .catch((error) => {
    console.err(error)
    process.exit(1);
  });
