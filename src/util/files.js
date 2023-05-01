import { glob } from "glob";

/**
 * Get file paths from a srcDir glob pattern
 *
 * @param  {string}            srcDir  The source directory
 * @param  {boolean}           cli     Whether the function is called from the CLI
 * @return {Promise<string[]>}
 */
export const getFiles = async (srcDir, cli) => {
  let files = [];
  const patterns = srcDir.split(" ");
  if (cli !== true) {
    for (const pattern of patterns) {
      let contents = await glob(pattern);
      files.push(...contents);
    }
  } else {
    files = [...patterns];
  }
  return files;
};
