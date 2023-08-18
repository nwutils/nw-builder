const NwBuilder = require("../lib/index.cjs");

const nw = new NwBuilder({
    files: "app/*",
    version: "0.67.1",
});

nw.build();
