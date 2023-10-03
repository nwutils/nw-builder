const { writeFile } = require("node:fs/promises");

const jsdoc2md = require("jsdoc-to-markdown");

jsdoc2md
    .render({
        files: "src/index.js",
    })
    .then(async (output) => {
        await writeFile("docs/index.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/build.js",
    })
    .then(async (output) => {
        await writeFile("docs/mode-build.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/get.js",
    })
    .then(async (output) => {
        await writeFile("docs/mode-get.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/run.js",
    })
    .then(async (output) => {
        await writeFile("docs/mode-run.md", output);
    })
    .catch((error) => {
        console.log(error);
    });
