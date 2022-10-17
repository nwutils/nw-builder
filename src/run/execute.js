import child_process from "node:child_process";

/**
 *
 * @param srcDir
 * @param nwPath
 */
const execute = (srcDir, nwPath) => {
  return new Promise((resolve, reject) => {
    const nwProcess = child_process.spawn(nwPath, [srcDir]);

    nwProcess.on("close", () => {
      resolve(0);
    });

    nwProcess.on("error", (error) => {
      console.log(error);
      reject(1);
    });
  });
};

export { execute };
