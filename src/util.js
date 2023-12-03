import console from "node:console";
import fsm from "node:fs/promises";
import https from "node:https";
import path from "node:path";

import * as GlobModule from "glob";

/**
 * Get manifest (array of NW release metadata) from URL
 *
 * @param  {string}                       manifestUrl  Url to manifest
 * @return {Promise <object | undefined>}
 */
function getManifest(manifestUrl) {
  let chunks = undefined;

  return new Promise((res) => {
    const req = https.get(manifestUrl, (res) => {
      res.on("data", (chunk) => {
        chunks += chunk;
      });

      res.on("error", (e) => {
        console.error(e);
        res(undefined);
      });

      res.on("end", () => {
        res(chunks);
      });
    });
    req.on("error", (e) => {
      console.error(e);
      res(undefined);
    });
  });
}

/**
 * Get version specific release metadata
 *
 * @param  {string} version      NW version
 * @param  {string} platform     NW platform
 * @param  {string} arch         NW architecture
 * @param  {string} cacheDir     Directory to store NW binaries
 * @param  {string} manifestUrl  Url to manifest
 * @return {object}              Version specific release info
 */
async function getReleaseInfo(
  version,
  platform,
  arch,
  cacheDir,
  manifestUrl,
) {
  let releaseData = undefined;
  let manifestPath = undefined;
  if (platform === "osx" && arch === "arm64") {
    manifestPath = path.resolve(cacheDir, "manifest.mac.arm.json");
  } else {
    manifestPath = path.resolve(cacheDir, "manifest.json");
  }

  try {
    const data = await getManifest(manifestUrl);
    if (data !== undefined) {
      await fsm.writeFile(manifestPath, data.slice(9));
    }

    let manifest = JSON.parse(await fsm.readFile(manifestPath));
    if (version === "latest" || version === "stable" || version === "lts") {
      // Remove leading "v" from version string
      version = manifest[version].slice(1);
    }

    releaseData = manifest.versions.find(
      (release) => release.version === `v${version}`,
    );
  } catch (e) {
    console.error(
      "The version manifest does not exist/was not downloaded. Please try again in some time.",
    );
  }
  return releaseData;
}

const PLATFORM_KV = {
  darwin: "osx",
  linux: "linux",
  win32: "win",
};

const ARCH_KV = {
  x64: "x64",
  ia32: "ia32",
  arm64: "arm64",
};

const EXE_NAME = {
  win: "nw.exe",
  osx: "nwjs.app/Contents/MacOS/nwjs",
  linux: "nw",
};

/**
 * Replaces the ffmpeg file in the nwjs directory with the one provided
 *
 * @param {string} platform  The platform to replace the ffmpeg file for
 * @param {string} nwDir     The directory of the nwjs installation
 */
const replaceFfmpeg = async (platform, nwDir) => {
  let ffmpegFile;
  if (platform === "linux") {
    ffmpegFile = "libffmpeg.so";
  } else if (platform === "win") {
    ffmpegFile = "ffmpeg.dll";
  } else if (platform === "osx") {
    ffmpegFile = "libffmpeg.dylib";
  }
  const src = path.resolve(nwDir, ffmpegFile);
  if (platform === "linux") {
    const dest = path.resolve(nwDir, "lib", ffmpegFile);
    await fsm.copyFile(src, dest);
  } else if (platform === "win") {
    // don't do anything for windows because the extracted file is already in the correct path
    // await copyFile(src, path.resolve(nwDir, ffmpegFile));
  } else if (platform === "osx") {
    let dest = path.resolve(
      nwDir,
      "nwjs.app",
      "Contents",
      "Frameworks",
      "nwjs Framework.framework",
      "Versions",
      "Current",
      ffmpegFile,
    );

    try {
      await fsm.copyFile(src, dest);
    } catch (e) {
      //some versions of node/macOS complain about destination being a file, and others complain when it is only a directory.
      //the only thing I can think to do is to try both
      dest = path.resolve(
        nwDir,
        "nwjs.app",
        "Contents",
        "Frameworks",
        "nwjs Framework.framework",
        "Versions",
        "Current",
      );
      await fsm.copyFile(src, dest);
    }
  }
};

async function globFiles({
  srcDir,
  glob,
}) {
  let files;
  if (glob) {
    files = [];
    const patterns = srcDir.split(" ");
    for (const pattern of patterns) {
      let filePath = await GlobModule.glob(pattern);
      files.push(...filePath);
    }
  } else {
    files = srcDir;
  }
  return files;
}

async function getNodeManifest({
  srcDir, glob
}) {
  let manifest;
  let files;
  if (glob) {
    files = await globFiles({srcDir, glob});
    for (const file of files) {
      if (path.basename(file) === "package.json" && manifest === undefined) {
        manifest = JSON.parse(await fsm.readFile(file));
      }
    }
  } else {
    manifest = JSON.parse(await fsm.readFile(path.resolve(srcDir, "package.json")));
  }

  if (manifest === undefined) {
    throw new Error("package.json not found in srcDir file glob patterns.");
  }
  
  return manifest;
}

export default { getReleaseInfo, PLATFORM_KV, ARCH_KV, EXE_NAME, replaceFfmpeg, globFiles, getNodeManifest };