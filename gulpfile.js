// import { task } from "gulp";
import { nwbuild } from "./lib/index.cjs";
import pkg from 'gulp';
const { task } = pkg;

task("build-dev", (done) => {
  nwbuild({
    files: "./test/demo/**/*.*",
    mode: "build",
    version: "0.66.1"
    platforms: ["osx64"],
  });
  done();
});
