type Options = {
    srcDir: string,
    mode: "get" | "run" | "build",
    version: string | "latest" | "stable",
    flavor: "normal" | "sdk",
    platform: "linux" | "osx" | "win",
    arch: "ia32" | "x64" | "arm64",
    outDir: string,
    cacheDir: string,
    downloadUrl: string,
    manifestUrl: string,
    app: object,
    cache: boolean,
    zip: boolean | "zip",
    cli: boolean,
    ffmpeg: boolean,
    glob: boolean,
};

declare function nwbuild(options: Options): Promise<unknown>;

export default nwbuild;
