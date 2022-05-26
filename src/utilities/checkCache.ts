import fs from "fs";
import path from "path";

const checkCache = (filePath: string, files: string[]): boolean => {
    let missing: boolean = false;

    // If NW.js is above v0.12.3, then we don't know which files we want from the archives. So just check that the folder exists and has at least 3 files in it.
    if (files.length === 1 && files[0] === "*") {
        return fs.existsSync(filePath) && fs.readdirSync(filePath).length >= 2;
    }

    for (let file of files) {
        if (missing) {
            return false;
        }
        if (!fs.existsSync(path.join(filePath, file))) {
            missing = true;
        }
    }

    return !missing;
};

export default checkCache;