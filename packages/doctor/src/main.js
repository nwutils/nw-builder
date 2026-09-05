import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import util from "./util.js";

/**
 * Check if your environment is set up for NW.js development.
 * @param {object} options - options
 * @param {string} options.manifestUrl - URL of the manifest file to download
 * @param {string} options.cacheDir - Directory to save the downloaded file
 * @param {string} options.version - Version to check (e.g., "lts", "latest", "stable")
 * @param {string} options.srcDir - Directory of the source code
 * @returns {Promise<void>}
 */
async function doctor(options) {
  /* Node version manager */
  // TODO: Implement detection of Node version managers (nvm, n, volta) and check if the required Node.js version is installed. If not, provide instructions to install it.
  const nodeVersionManager = "none";
  /* Get the NW.js versions manifest */
  const manifestPath = path.resolve(options.cacheDir, "manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  await util.request(options.manifestUrl, manifestPath);

  /* Get required Node.js version */
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (
    options.version === "latest" ||
    options.version === "stable" ||
    options.version === "lts"
  ) {
    // Remove leading "v" from version string
    options.version = manifest[options.version].slice(1);
  }
  let releaseData = manifest.versions.find(
    /** @param {{ version: string, components: { node: string } }} release */
    (release) => release.version === `v${options.version}`,
  );

  const nodeRequiredVersion = releaseData.components.node;
  console.log(
    "[ INFO ] The required Node.js version is: " + nodeRequiredVersion,
  );

  const nodeCurrentVersion = process.versions["node"];
  if (nodeCurrentVersion !== nodeRequiredVersion) {
    console.log(
      "[ WARN ] Your installed Node.js version is: " +
        nodeCurrentVersion +
        ". Native addons may not build properly.",
    );
    console.log(
      "[ INFO ] Install the required Node.js version via a Node verssion manager (e.g., nvm, n, volta) or download it from https://nodejs.org/en/download/releases/.",
    );
  } else {
    console.log("[ INFO ] Your installed Node.js version is compatible.");
  }

  await util.request(
    "https://registry.npmjs.org/-/package/npm/dist-tags",
    path.resolve(options.cacheDir, "npm-dist-tags.json"),
  );
  const npmLatestVersion = JSON.parse(
    fs.readFileSync(
      path.resolve(options.cacheDir, "npm-dist-tags.json"),
      "utf8",
    ),
  )["latest"];
  console.log("[ INFO ] The latest npm version is: " + npmLatestVersion);
  const npmCurrentVersion = child_process
    .execSync("npm --version", { encoding: "utf8" })
    .trim();
  console.log("[ WARN ] The installed npm version is: " + npmCurrentVersion);

  const nodeManifestPath = path.resolve(options.srcDir, "package.json");
  if (fs.existsSync(nodeManifestPath) && nodeVersionManager === "none") {
    const nodeManifest = JSON.parse(fs.readFileSync(nodeManifestPath, "utf8"));
    nodeManifest.devEngines = {
      runtime: {
        name: "node",
        onFail: "warn",
        version: nodeRequiredVersion,
      },
      packageManager: {
        name: "npm",
        version: npmLatestVersion,
        onFail: "warn",
      },
    };
    fs.writeFileSync(nodeManifestPath, JSON.stringify(nodeManifest, null, 2));
  }
}

export default doctor;
