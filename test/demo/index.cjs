const NwBuilder = require("../../lib/index.cjs");

const nw = new NwBuilder({
  files: "./**",
  version: "0.68.0",
  flavor: "normal",
});

nw.run()
  .then((msg) => {
    console.log(msg);
  })
  .catch((error) => {
    console.log(error);
  });
