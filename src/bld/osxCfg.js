import fs from "node:fs/promises";

import plist from "plist";

const setOsxConfig = async (pkg, outDir) => {
    let contents_info_plist_path = `${outDir}/nwjs.app/Contents/Info.plist`;
    let contents_info_plist_json = plist.parse(await fs.readFile(contents_info_plist_path, "utf-8"));
    contents_info_plist_json.CFBundleDisplayName = pkg.name;
    let contents_info_plist = plist.build(contents_info_plist_json);
    await fs.writeFile(contents_info_plist_path, contents_info_plist, { signal });
};

export {
    setOsxConfig,
}