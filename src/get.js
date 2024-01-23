import fs from "node:fs";
import https from "node:https";
import path from "node:path";

import progress from "cli-progress";
import tar from "tar";

import util from "./util.js";

/**
 * @typedef {object} GetOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]                  Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]                   Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]                            Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                                Target arch
 * @property {string}                               [downloadUrl = "https://dl.nwjs.io"]  Download server
 * @property {string}                               [cacheDir = "./cache"]                Cache directory
 * @property {boolean}                              [cache = true]                        If false, remove cache and redownload.
 * @property {boolean}                              [ffmpeg = false]                      If true, ffmpeg is not downloaded.
 * @property {false | "gyp"}                        [nativeAddon = false]                 Rebuild native modules
 */

/**
 * Get binaries.
 *
 * @async
 * @function
 * @param  {GetOptions}    options                  Get mode options
 * @returns {Promise<void>}
 */
async function get(options) {
  if (fs.existsSync(options.cacheDir) === false) {
    await fs.promises.mkdir(options.cacheDir, { recursive: true });
  }
  await getNwjs(options);
  if (options.ffmpeg === true) {
    await getFfmpeg(options);
  }
  if (options.nativeAddon === "gyp") {
    await getNodeHeaders(options);
  }
}

const getNwjs = async (options) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const out = path.resolve(
    options.cacheDir,
    `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}.${options.platform === "linux" ? "tar.gz" : "zip"
    }`,
  );
  // If options.cache is false, remove cache.
  if (options.cache === false) {
    await fs.promises.rm(out, {
      recursive: true,
      force: true,
    });
  }

  if (fs.existsSync(out) === true) {
    await fs.promises.rm(
      path.resolve(
        options.cacheDir,
        `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`,
      ),
      { recursive: true, force: true },
    );
    if (options.platform === "linux") {
      await tar.extract({
        file: out,
        C: options.cacheDir
      });
    } else {
      await util.unzip(out, options.cacheDir);
      if (options.platform === "osx") {
        await createSymlinks(options);
      }
    }
    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    let url = "";

    // Set download url and destination.
    if (
      options.downloadUrl === "https://dl.nwjs.io" ||
      options.downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
      options.downloadUrl === "https://npmmirror.com/mirrors/nwjs"
    ) {
      url = `${options.downloadUrl}/v${options.version}/nwjs${options.flavor === "sdk" ? "-sdk" : ""
      }-v${options.version}-${options.platform}-${options.arch}.${options.platform === "linux" ? "tar.gz" : "zip"
      }`;
    }

    https.get(url, (response) => {
      // For GitHub releases and mirrors, we need to follow the redirect.
      if (
        options.downloadUrl === "https://npm.taobao.org/mirrors/nwjs" ||
        options.downloadUrl === "https://npmmirror.com/mirrors/nwjs"
      ) {
        url = response.headers.location;
      }

      https.get(url, (response) => {
        let chunks = 0;
        bar.start(Number(response.headers["content-length"]), 0);
        response.on("data", (chunk) => {
          chunks += chunk.length;
          bar.increment();
          bar.update(chunks);
        });

        response.on("error", (error) => {
          rej(error);
        });

        response.on("end", () => {
          bar.stop();
          res();
        });

        response.pipe(stream);
      });

      response.on("error", (error) => {
        rej(error);
      });
    });
  });

  await request;
  await fs.promises.rm(
    path.resolve(
      options.cacheDir,
      `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`,
    ),
    { recursive: true, force: true },
  );
  if (options.platform === "linux") {
    await tar.extract({
      file: out,
      C: options.cacheDir
    });
  } else {
    await util.unzip(out, options.cacheDir);
    if (options.platform === "osx") {
      await createSymlinks(options);
    }

  }
}


const getFfmpeg = async (options) => {
  const nwDir = path.resolve(
    options.cacheDir,
    `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`,
  );
  const bar = new progress.SingleBar({}, progress.Presets.rect);

  // If options.ffmpeg is true, then download ffmpeg.
  options.downloadUrl = "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download";
  let url = `${options.downloadUrl}/${options.version}/${options.version}-${options.platform}-${options.arch}.zip`;
  const out = path.resolve(options.cacheDir, `ffmpeg-v${options.version}-${options.platform}-${options.arch}.zip`);

  // If options.cache is false, remove cache.
  if (options.cache === false) {
    await fs.promises.rm(out, {
      recursive: true,
      force: true,
    });
  }

  // Check if cache exists.
  if (fs.existsSync(out) === true) {
    await util.unzip(out, nwDir);
    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    https.get(url, (response) => {
      // For GitHub releases and mirrors, we need to follow the redirect.
      url = response.headers.location;

      https.get(url, (response) => {
        let chunks = 0;
        bar.start(Number(response.headers["content-length"]), 0);
        response.on("data", (chunk) => {
          chunks += chunk.length;
          bar.increment();
          bar.update(chunks);
        });

        response.on("error", (error) => {
          rej(error);
        });

        response.on("end", () => {
          bar.stop();
          res();
        });

        response.pipe(stream);
      });

      response.on("error", (error) => {
        rej(error);
      });
    });
  });

  // Remove compressed file after download and decompress.
  await request;
  await util.unzip(out, nwDir);
  await util.replaceFfmpeg(options.platform, nwDir);
}

const getNodeHeaders = async (options) => {
  const bar = new progress.SingleBar({}, progress.Presets.rect);
  const out = path.resolve(
    options.cacheDir,
    `headers-v${options.version}-${options.platform}-${options.arch}.tar.gz`,
  );

  // If options.cache is false, remove cache.
  if (options.cache === false) {
    await fs.promises.rm(out, {
      recursive: true,
      force: true,
    });
  }

  if (fs.existsSync(out) === true) {
    await tar.extract({
      file: out,
      C: options.cacheDir
    });
    await fs.promises.rm(path.resolve(options.cacheDir, `node-v${options.version}-${options.platform}-${options.arch}`), {
      recursive: true,
      force: true,
    });
    await fs.promises.rename(
      path.resolve(options.cacheDir, "node"),
      path.resolve(options.cacheDir, `node-v${options.version}-${options.platform}-${options.arch}`),
    );
    return;
  }

  const stream = fs.createWriteStream(out);
  const request = new Promise((res, rej) => {
    const url = `${options.downloadUrl}/v${options.version}/nw-headers-v${options.version}.tar.gz`;
    https.get(url, (response) => {
      let chunks = 0;
      bar.start(Number(response.headers["content-length"]), 0);
      response.on("data", (chunk) => {
        chunks += chunk.length;
        bar.increment();
        bar.update(chunks);
      });

      response.on("error", (error) => {
        rej(error);
      });

      response.on("end", () => {
        bar.stop();
        res();
      });

      response.pipe(stream);
    });
  });

  await request;
  await tar.extract({
    file: out,
    C: options.cacheDir
  });
  await fs.promises.rename(
    path.resolve(options.cacheDir, "node"),
    path.resolve(options.cacheDir, `node-v${options.version}-${options.platform}-${options.arch}`),
  );
}

const createSymlinks = async (options) => {
  const frameworksPath = path.join(process.cwd(), options.cacheDir, `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
  const symlinks = [
    path.join(frameworksPath, "Helpers"),
    path.join(frameworksPath, "Libraries"),
    path.join(frameworksPath, "nwjs Framework"),
    path.join(frameworksPath, "Resources"),
    path.join(frameworksPath, "Versions", "Current"),
  ];
  for await (const symlink of symlinks) {
    const buffer = await fs.promises.readFile(symlink);
    const link = buffer.toString();
    await fs.promises.rm(symlink);
    await fs.promises.symlink(link, symlink);
  }
};

export default get;
