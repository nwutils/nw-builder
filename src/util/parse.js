import { arch, cwd, platform } from "node:process";

import { getArch } from "./arch.js";
import { getPlatform } from "./platform.js";

/**
 * Parse options
 *
 * @param  {object}          options  Options
 * @param  {object}          pkg      Package.json as JSON
 * @return {Promise<object>}          Options
 */
export const parse = async (options, pkg) => {
  if (typeof pkg?.nwbuild === "object") {
    options = { ...pkg.nwbuild };
  }

  options.srcDir = options.srcDir ?? "./";
  options.mode = options.mode ?? "build";
  options.version = options.version ?? "latest";
  options.flavor = options.flavor || "normal";
  options.platform = options.platform ?? getPlatform(platform);
  options.arch = options.arch ?? getArch(arch);
  options.outDir = options.outDir ?? "./out";
  options.cacheDir = options.cacheDir ?? `${cwd()}/cache`;
  options.downloadUrl = options.downloadUrl ?? "https://dl.nwjs.io";
  options.manifestUrl = options.manifestUrl ?? "https://nwjs.io/versions";
  options.app = {};
  options.argv = options.argv ?? [];
  // linux desktop entry file configurations options
  options.app.name = options.app.name ?? pkg.name;
  options.app.genericName = options.app.genericName ?? undefined;
  options.app.noDisplay = options.app.noDisplay ?? undefined;
  options.app.comment = options.app.comment ?? undefined;
  options.app.icon = options.app.icon ?? undefined;
  options.app.hidden = options.app.hidden ?? undefined;
  options.app.onlyShowIn = options.app.onlyShowIn ?? undefined;
  options.app.notShowIn = options.app.notShowIn ?? undefined;
  options.app.dBusActivatable = options.app.dBusActivatable ?? undefined;
  options.app.tryExec = options.app.tryExec ?? undefined;
  options.app.exec = options.app.name ?? undefined;
  options.app.path = options.app.path ?? undefined;
  options.app.terminal = options.app.terminal ?? undefined;
  options.app.actions = options.app.actions ?? undefined;
  options.app.mimeType = options.app.mimeType ?? undefined;
  options.app.categories = options.app.categories ?? undefined;
  options.app.implements = options.app.implements ?? undefined;
  options.app.keywords = options.app.keywords ?? undefined;
  options.app.startupNotify = options.app.startupNotify ?? undefined;
  options.app.startupWMClass = options.app.startupWMClass ?? undefined;
  options.app.prefersNonDefaultGPU =
    options.app.prefersNonDefaultGPU ?? undefined;
  options.app.singleMainWindow = options.app.singleMainWindow ?? undefined;
  // windows configuration options
  options.app.comments = options.app.comments ?? undefined;
  options.app.company = options.app.company ?? pkg.author;
  options.app.fileDescription = options.app.fileDescription ?? pkg.description;
  options.app.fileVersion = options.app.fileVersion ?? pkg.version;
  options.app.internalName = options.app.internalName ?? pkg.name;
  options.app.legalCopyright = options.app.legalCopyright ?? undefined;
  options.app.legalTrademark = options.app.legalTrademark ?? undefined;
  options.app.originalFilename = options.app.originalFilename ?? pkg.name;
  options.app.privateBuild = options.app.privateBuild ?? undefined;
  options.app.productName = options.app.productName ?? pkg.name;
  options.app.productVersion = options.app.productVersion ?? pkg.version;
  options.app.specialBuild = options.app.specialBuild ?? undefined;
  options.cache = options.cache ?? true;
  options.zip = options.zip ?? false;
  return options;
};
