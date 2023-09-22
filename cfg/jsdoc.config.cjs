const { writeFile } = require("node:fs/promises");

const jsdoc2md = require("jsdoc-to-markdown");

jsdoc2md
    .render({
        files: "src/build.js",
    })
    .then(async (output) => {
        await writeFile("doc/mode-build.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/get.js",
    })
    .then(async (output) => {
        await writeFile("doc/mode-get.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/run.js",
    })
    .then(async (output) => {
        await writeFile("doc/mode-run.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/index.js",
    })
    .then(async (output) => {
        await writeFile("doc/api.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/bld/linuxCfg.js",
    })
    .then(async (output) => {
        await writeFile("doc/api-nux.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/bld/winCfg.js",
    })
    .then(async (output) => {
        await writeFile("doc/api-win.md", output);
    })
    .catch((error) => {
        console.log(error);
    });

jsdoc2md
    .render({
        files: "src/bld/osxCfg.js",
    })
    .then(async (output) => {
        await writeFile("doc/api-osx.md", output);
    })
    .catch((error) => {
        console.log(error);
    });