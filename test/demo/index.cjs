const NwBuilder = require("../../lib/index.cjs");

const nw = new NwBuilder({
  files: "./**",
});

nw.on("log", (msg) => console.log("nw-builder", msg));

nw.on("appstart", () => {
  process.exit(0);
})

nw.run()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
