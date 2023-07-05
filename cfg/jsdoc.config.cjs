const { writeFile } =require("node:fs/promises");

const jsdoc2md = require("jsdoc-to-markdown");

jsdoc2md
    .render({
        files: "src/get.js",
    })
    .then(async (output) => {
        await writeFile("doc/get.md", output);
    })