const NwBuilder = require("../../lib/index.cjs");

const nw = new NwBuilder({
  files: "./**",
  version: "0.67.1",
  platforms: ["linux64"],
});

// Replace `build` with `run` to run the application instead
nw.build()
  .then((msg) => {
    console.log(msg);
  })
  .catch((error) => {
    console.log(error);
  });
