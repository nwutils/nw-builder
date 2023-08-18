const NwBuilder = require("../../lib/index.cjs");

const nw = new NwBuilder({
    files: "./**",
    version: "0.67.1",
    platforms: ["linux64"],
    mode: "build",
});

nw.run();