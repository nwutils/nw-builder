/**
 * @readonly
 * @enum {string}
 */
const Platform = {
  NIX_32: "linux32",
  NIX_64: "linux64",
  OSX_32: "osx32",
  OSX_64: "osx64",
  WIN_32: "win32",
  WIN_64: "win64",
};

Object.freeze(Platform);

export default Platform;
