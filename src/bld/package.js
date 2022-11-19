import fs from "node:fs";
import path from "node:path"

import { compress } from "./compress.js";
import { setLinuxConfig } from "./linuxCfg.js";
import { setOsxConfig } from "./osxCfg.js";
import { setWinConfig } from "./winCfg.js";

import { globby } from 'globby';

const getAllFiles = function(dirPath, arrayOfFiles) {
  dirPath = path.resolve(dirPath)
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(dirPath + "/" + file)
    }
  })

  return arrayOfFiles;
}

const packager = async (srcDir, nwDir, outDir, platform, zip, releaseInfo, excludes) => {
  fs.rmSync(outDir, { force: true, recursive: true });
  fs.cpSync(nwDir, outDir, { recursive: true });

  const nwAppDir =`${outDir}/${
    platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"
  }`
  fs.mkdirSync(nwAppDir, {recursive: true});

  const excludePaths = await globby(excludes);
  const excludeResolvedPaths = excludePaths.map((file) => {return path.resolve(file)})
  const files = getAllFiles(srcDir)

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const resolvedFile = path.resolve(file);
    if (!excludeResolvedPaths.includes(resolvedFile)) {
      fs.cpSync(
        path.resolve(file), 
        `${nwAppDir}/${file.replace(path.resolve(srcDir), '')}`,
        {
          recursive: true
        }
      )
    }
  }

  let buffer = fs.readFileSync(
    `${outDir}/${
      platform !== "osx" ? "package.nw" : "nwjs.app/Contents/Resources/nw.app"
    }/package.json`,
  );
  let pkg = JSON.parse(buffer);

  switch (platform) {
    case "linux":
      setLinuxConfig(pkg, outDir);
      break;
    case "win":
      setWinConfig(pkg, outDir);
      break;
    case "osx":
      setOsxConfig(pkg, outDir, releaseInfo);
      break;
    default:
      break;
  }

  if (zip === true) {
    await compress(outDir);
  } else if (zip === "zip" || zip === "tar") {
    await compress(outDir, zip);
  }

  return 0;
};

export { packager };
