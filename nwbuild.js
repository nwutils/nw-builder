import { remove } from "./install/remove.js";
import { decompress } from "./install/decompress.js";
import { download } from "./install/download.js";

const nwbuild = async ({
    srcDir,
    version,
    flavour,
    platform,
    arch,
    downloadUrl="https://dl.nwjs.io",
    manifestUrl,
    outDir,
    // flags
    noCache=false,
    noGlob=true,
    zip=false,
}) => {

    // validate inputs

    // download nw

    await download(
        version,
        flavour,
        platform,
        arch,
        downloadUrl,
        outDir,
    );

    await decompress(
        platform,
        outDir,
    );

    await remove(
        platform,
        outDir,
    );

    // decompress nw

    // rename nw

    // run app

    // linux config

    // window config

    // macos config

    // build app

};