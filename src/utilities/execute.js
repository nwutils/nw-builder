import child_process from "node:child_process";

const execute = (exePath, argv) => {
  return new Promise((resolve, reject) => {
    const nwProcess = child_process.spawn(exePath, [argv]);

    nwProcess.on("close", () => {
      resolve(0);
    });

    nwProcess.on("error", (error) => {
      console.log(error);
      reject(1);
    });
  });
};

export default execute;
