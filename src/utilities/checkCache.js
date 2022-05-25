const fs = require("fs");
const path = require("path");

const checkCache = (cacheDir, files) => {
  let missing = false;

  /* If NW.js version is v0.12.3 or above, then we don't know which files we want from the archives. So we just check that the folder exists and has at least 3 files in it. */
  if (files.length === 1 && files[0] === "*") {
    return fs.existsSync(cacheDir) && fs.readdirSync(cacheDir).length >= 2;
  }

  files.forEach((file) => {
    if (missing === true) {
      return;
    }
    if (!fs.existsSync(path.join(cacheDir, file))) {
      missing = true;
    }
  });
};

module.exports = checkCache;
