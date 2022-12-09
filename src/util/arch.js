/**
 * Get user's computer architecture
 *
 * @param  {string}                arch  Node's process.arch
 * @return {"ia32"| "x64" | Error}       NW.js supported architectures
 */
export const getArch = (arch) => {
  if (!["ia32", "x64"].includes(arch)) {
    throw new Error(
      `The architecture ${arch} is either invalid or not supported.`,
    );
  }
  return arch;
};
