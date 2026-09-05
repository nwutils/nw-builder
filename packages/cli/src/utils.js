import os from "node:os";
import path from "node:path";

/** @type {Record<'darwin' | 'linux' | 'win32', string>} */
const PLATFORM_KV = {
  darwin: 'osx',
  linux: 'linux',
  win32: 'win',
};

/** @type {Record<'x64' | 'ia32' | 'arm64', string>} */
const ARCH_KV = {
  x64: 'x64',
  ia32: 'ia32',
  arm64: 'arm64',
};

/**
 * @returns {string}
 */
function resolvePlatform() {
  const key = process.platform;

  if (!(key in PLATFORM_KV)) {
    throw new Error(`Unsupported platform: ${key}`);
  }

  const typedKey = /** @type {keyof typeof PLATFORM_KV} */ (key);
  return PLATFORM_KV[typedKey];
}

/**
 * @returns {string}
 */
function resolveArch() {
  const key = process.arch;

  if (!(key in ARCH_KV)) {
    throw new Error(`Unsupported arch: ${key}`);
  }

  const typedKey = /** @type {keyof typeof ARCH_KV} */ (key);
  return ARCH_KV[typedKey];
}

const CACHE_DIR = path.join(os.homedir(), '.nw-cli', 'cache');

export default {
  resolvePlatform,
  resolveArch,
  CACHE_DIR,
};
