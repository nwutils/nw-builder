/**
 *
 * @param {NodeJS.Process} process
 * @returns {"ia32" | "x64"}
 */
const getArch = (process) => {
  switch (process.arch) {
    case "x64":
      return "x64";
    case "ia32":
      return "ia32";
    default:
      return null;
  }
};

export { getArch };
