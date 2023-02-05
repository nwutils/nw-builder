import { spawn } from "node:child_process";
import { platform } from "node:process";

import nwbuild from "nw-builder";

import { log } from "../../src/log.js";

let nwProcess = null;

if (platform === "linux") {
  await nwbuild({
    srcDir: "./nwapp/**/*",
    mode: "build",
    version: "latest",
    flavor: "normal",
    platform: "linux",
    arch: "x64",
    outDir: "./build/nix",
  });

  nwProcess = spawn("./build/nix/nwdemo", {
    detached: true,
    windowsHide: true,
  });

  nwProcess.on("nw_demo_running", () => {
    log.debug("Kill NW build after confirming that it runs in CI.");
    nwProcess.kill("SIGKILL");
  });

  nwProcess.emit("nw_demo_running");
}

if (platform === "darwin") {
  await nwbuild({
    srcDir: "./nwapp/**/*",
    mode: "build",
    version: "latest",
    flavor: "normal",
    platform: "osx",
    arch: "x64",
    outDir: "./build/osx",
  });

  nwProcess = spawn("./build/osx/nwdemo", {
    detached: true,
    windowsHide: true,
  });

  nwProcess.on("nw_demo_running", () => {
    log.debug("Kill NW build after confirming that it runs in CI.");
    nwProcess.kill("SIGKILL");
  });

  nwProcess.emit("nw_demo_running");
}

if (platform === "win32") {
  await nwbuild({
    srcDir: "./nwapp/**/*",
    mode: "build",
    version: "latest",
    flavor: "normal",
    platform: "win",
    arch: "x64",
    outDir: "./build/win",
  });

  nwProcess = spawn("./build/win/nwdemo", {
    detached: true,
    windowsHide: true,
  });

  nwProcess.on("nw_demo_running", () => {
    log.debug("Kill NW build after confirming that it runs in CI.");
    nwProcess.kill("SIGKILL");
  });

  nwProcess.emit("nw_demo_running");
}
