import { access, constants, mkdir, readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";

import { decompress } from "./get/decompress.js";
import { develop } from "./run/develop.js";
import { download } from "./get/download.js";
import { getReleaseInfo } from "./get/getReleaseInfo.js";
import { remove } from "./get/remove.js";
import { packager } from "./bld/package.js";
import { parse } from "./util/parse.js";
import { validate } from "./util/validate.js";

import { log } from "./log.js";

const nwbuild = async (options) => {
  let hasCache = true;
  let nwDir = "";
  let releaseInfo = {};
  try {
    if ((await access(options.srcDir), constants.F_OK)) {
      let pkgFile = await readFile(`${options.src}/package.json`);
      let pkgJSON = JSON.parse(pkgFile);
      if (pkgJSON === "object") {
        if (pkgJSON.name && pkgJSON.main) {
          if (typeof pkgJSON.nwbuild === "object") {
            options = { ...pkgJSON.nwbuild };
          } else {
            throw new Error(
              `The nwbuild property in the ${options.srcDir}/package.json is not an object.`,
            );
          }
        } else {
          throw new Error(
            `${options.srcDir}/package.json either does not have a name or main property`,
          );
        }
      } else {
        throw new Error(`${options.srcDir}/package.json is not a JSON format`);
      }
    }

    options = await parse(options);

    await mkdir(options.cacheDir, { recursive: true });

    releaseInfo = await getReleaseInfo(
      options.version,
      options.cacheDir,
      options.manifestUrl,
    );

    nwDir = `${options.cacheDir}/nwjs${
      options.flavour === "sdk" ? "-sdk" : ""
    }-v${options.version}-${options.platform}-${options.arch}`;

    const e = readFileSync(nwDir);

    console.log("hello", e);

    await validate(options, releaseInfo);
  } catch (error) {
    log.error(error);
  } finally {
    if (options?.noCache === true || hasCache === false) {
      await rm(nwDir, { force: true, recursive: true });
      await download(
        options.version,
        options.flavour,
        options.platform,
        options.arch,
        options.downloadUrl,
        options.cacheDir,
      );
      await decompress(options.platform, options.cacheDir);
      await remove(options.platform, options.cacheDir);
    }

    if (options && options.mode === "run") {
      await develop(options.srcDir, nwDir, options.platform);
    }
    if (options && options.mode === "build") {
      await packager(
        options.srcDir,
        nwDir,
        options.outDir,
        options.platform,
        options.zip,
        releaseInfo,
      );
    } else {
      log.error("Invalid mode. Expected `run` or `build`");
    }
  }
};

export { nwbuild };
