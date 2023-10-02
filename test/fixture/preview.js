import { spawn } from "node:child_process";
import { resolve } from "node:path";

const process = spawn(resolve(
    "out",
    "Demo.app"
));

process.on("error", (error) => {
    console.log(error);   
});
