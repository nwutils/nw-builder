const NwBuilder = require("../lib/index.cjs");

const nw = new NwBuilder({
    files: "test/demo/*",
    version: "0.67.1",
});

nw.run();
