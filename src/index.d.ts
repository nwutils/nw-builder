
/** NW supported platform */
export type SupportedPlatform = "linux" | "osx" | "win";

/** Configuration options
 */
export interface Options<P extends SupportedPlatform = SupportedPlatform> {
    /** String of space separated glob patterns which correspond to NW app code */
    srcDir?: "./" | string,
    /** Run or build application */
    mode?: "build" | "get" | "run",
    /** NW runtime version */
    version?: "latest" | "stable" | string,
    /** NW runtime flavor */
    flavor?: "normal" | "sdk",
    /** NW supported platforms */
    platform?: P,
    /** NW supported architectures */
    arch?: "ia32" | "x64" | "arm64",
    /** Directory to store build artifacts */
    outDir?: "./out" | string,
    /** Directry to store NW binaries */
    cacheDir?: "./cache" | string,
    /** URI to download NW binaries from */
    downloadUrl?: "https://dl.nwjs.io" | string,
    /** URI to download manifest */
    manifestUrl?: "https://nwjs.io/versions" | string,
    /** Refer to Linux/Windows/Osx specific options */
    app: AppOptions<P>,
    /** If true the existing cache is used. Otherwise it removes and redownloads it. */
    cache?: boolean,
    /** If true, "zip", "tar" or "tgz" the outDir directory is compressed. */
    zip?: boolean | "zip" | "tar" | "tgz",
    /** If true the CLI is used to glob srcDir and parse other options */
    cli?: boolean,
    /** If true the chromium ffmpeg is replaced by community version */
    ffmpeg?: boolean,
    /** If true globbing is enabled */
    glob?: boolean,
    /** Specified log level. */
    logLevel?: "error" | "warn" | "info" | "debug",
}

/** Platform-specific application options */
export type AppOptions<P extends SupportedPlatform> =
    P extends 'win' ? WindowsAppOptions :
    P extends 'osx' ? OsxAppOptions :
    P extends 'linux' ? LinuxAppOptions
    : (WindowsAppOptions | OsxAppOptions | LinuxAppOptions);

/** Windows configuration options
 * 
 * References:
 * - https://learn.microsoft.com/en-us/windows/win32/msi/version
 * - https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
 * - https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel
 * - https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource
 */
export interface WindowsAppOptions {
    /** The name of the application */
    name?: string,
    /** The version of the application */
    version?: string,
    /** Additional information that should be displayed for diagnostic purposes. */
    comments?: string,
    /** Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required. */
    company: string,
    /** File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required. */
    fileDescription: string,
    /** Version number of the file. For example, 3.10 or 5.00.RC2. This string is required. */
    fileVersion: string,
    /** The path to the icon file. It should be a .ico file. */
    icon?: string,
    /** Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required. */
    internalName: string,
    /** Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional. */
    legalCopyright?: string,
    /** Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional. */
    legalTrademark?: string,
    /** Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required. */
    originalFilename: string,
    /** Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block. */
    privateBuild?: string,
    /** Name of the product with which the file is distributed. This string is required. */
    productName: string,
    /** Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required. */
    productVersion: string,
    /** Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block. */
    specialBuild?: string,
}

/** Linux configuration options
 * 
 * References:
 * https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html
 */
export interface LinuxAppOptions {
    /** Name of the application */
    name?: string,   
    /** Generic name of the application */
    genericName?: string,   
    /** If true the application is not displayed */
    noDisplay?: boolean,  
    /** Tooltip for the entry, for example "View sites on the Internet". */
    comment?: string,   
    /** Icon to display in file manager, menus, etc. */
    icon?: string,   
    /** A list of strings identifying the desktop environments that should (/not) display a given desktop entry */
    onlyShowIn?: string[], 
    /**  A list of strings identifying the desktop environments that should (/not) display a given desktop entry */
    notShowIn?: string[], 
    /** A boolean value specifying if D-Bus activation is supported for this application */
    dBusActivatable?: boolean,
    /** Path to an executable file on disk used to determine if the program is actually installed */
    tryExec?: string,
    /** Program to execute, possibly with arguments. */
    exec?: string,
    /** If entry is of type Application, the working directory to run the program in. */
    path?: string,
    /** Whether the program runs in a terminal window. */
    terminal?: boolean,
    /** Identifiers for application actions. */
    actions?: string[],
    /** The MIME type(s) supported by this application. */
    mimeType?: string[],
    /** Categories in which the entry should be shown in a menu */
    categories?: string[],
    /** A list of interfaces that this application implements. */
    implements?: string[],
    /** A list of strings which may be used in addition to other metadata to describe this entry. */
    keywords?: string[],
    /** If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all. */
    startupNotify?: boolean,
    /** If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin */
    startupWMClass?: string,
    /** If true, the application prefers to be run on a more powerful discrete GPU if available. */
    prefersNonDefaultGPU?: boolean,
    /** If true, the application has a single main window, and does not support having an additional one opened. */
    singleMainWindow?: string,
}

/** OSX resource configuration options
 * 
 * References:
 * https://developer.apple.com/documentation/bundleresources/information_property_list
 */
export interface OsxAppOptions {
    /** The name of the application */
    name?: string,
    /** The path to the icon file. It should be a .icns file. */
    icon?: string, 
    /** The category that best describes your app for the App Store. */
    LSApplicationCategoryType?: string, 
    /** A unique identifier for a bundle usually in reverse DNS format. */
    CFBundleIdentifier?: string, 
    /** A user-visible short name for the bundle. */
    CFBundleName?: string, 
    /** The user-visible name for the bundle. */
    CFBundleDisplayName?: string, 
    /** A replacement for the app name in text-to-speech operations. */
    CFBundleSpokenName?: string, 
    /** The version of the build that identifies an iteration of the bundle. */
    CFBundleVersion?: string, 
    /** The release or version number of the bundle. */
    CFBundleShortVersionString?: string, 
    /** A human-readable copyright notice for the bundle. */
    NSHumanReadableCopyright?: string, 
}

/**
 * Automates building an NW.js application.
 */
declare function nwbuild<P extends SupportedPlatform>(options: Options<P>): Promise<void>;

export default nwbuild;
