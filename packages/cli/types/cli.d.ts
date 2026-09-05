#!/usr/bin/env node
export type Options = {
    version: string;
    flavor: "normal" | "sdk";
    platform: "linux" | "osx" | "win";
    arch: "ia32" | "x64" | "arm64";
    downloadUrl: "https://dl.nwjs.io";
    manifestUrl: "https://nwjs.io/versions.json";
    cacheDir: string;
    cache: boolean;
    ffmpeg: boolean;
    nativeAddon: boolean;
    shaSum: boolean;
    srcDir: string;
    argv: string[];
};
export type CreateOptions = {
    template: string;
    outDir: string;
};
