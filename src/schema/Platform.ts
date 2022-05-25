enum Platform {
    NIX_32 = 'linux32',
    NIX_64 = 'linux64',
    OSX_32 = 'osx32',
    OSX_64 = 'osx64',
    WIN_32 = 'win32',
    WIN_64 = 'win64',
};

type PlatformSchema =
    Platform.NIX_32
    | Platform.NIX_32
    | Platform.NIX_64
    | Platform.OSX_32
    | Platform.OSX_64
    | Platform.WIN_32
    | Platform.WIN_64;

export {
    Platform,
    type PlatformSchema,
};