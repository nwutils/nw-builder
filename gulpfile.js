// import { task } from "gulp";
import { nwbuild } from "./lib/index.cjs";
import pkg from 'gulp';
const { task } = pkg;

task("build-dev", (done) => {
  nwbuild({
    files: "./test/demo/**/*.*",
    mode: "build",
    platforms: ["osx64"],
  });
  done();
});