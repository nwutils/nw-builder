## Functions

<dl>
<dt><a href="#nwbuild">nwbuild(options)</a> ⇒ <code>Promise.&lt;undefined&gt;</code></dt>
<dd><p>Entry point for nw-builder application</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LinuxRc">LinuxRc</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#WinRc">WinRc</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#App">App</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="nwbuild"></a>

## nwbuild(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
Entry point for nw-builder application

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#Options) | Options |

<a name="LinuxRc"></a>

## LinuxRc : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| genericName | <code>string</code> | Generic name of the application |
| noDisplay | <code>boolean</code> | If true the application is not displayed |
| comment | <code>string</code> | Tooltip for the entry, for example "View sites on the Internet". |
| icon | <code>string</code> | Icon to display in file manager, menus, etc. |
| hidden | <code>boolean</code> | TBD |
| onlyShowIn | <code>Array.&lt;string&gt;</code> | A list of strings identifying the desktop environments that should (/not) display a given desktop entry |
| notShowIn | <code>Array.&lt;string&gt;</code> | A list of strings identifying the desktop environments that should (/not) display a given desktop entry |
| dBusActivatable | <code>boolean</code> | A boolean value specifying if D-Bus activation is supported for this application |
| tryExec | <code>string</code> | Path to an executable file on disk used to determine if the program is actually installed |
| exec | <code>string</code> | Program to execute, possibly with arguments. |
| path | <code>string</code> | If entry is of type Application, the working directory to run the program in. |
| terminal | <code>boolean</code> | Whether the program runs in a terminal window. |
| actions | <code>Array.&lt;string&gt;</code> | Identifiers for application actions. |
| mimeType | <code>Array.&lt;string&gt;</code> | The MIME type(s) supported by this application. |
| categories | <code>Array.&lt;string&gt;</code> | Categories in which the entry should be shown in a menu |
| implements | <code>Array.&lt;string&gt;</code> | A list of interfaces that this application implements. |
| keywords | <code>Array.&lt;string&gt;</code> | A list of strings which may be used in addition to other metadata to describe this entry. |
| startupNotify | <code>boolean</code> | If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all. |
| startupWMClass | <code>string</code> | If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin |
| prefersNonDefaultGPU | <code>boolean</code> | If true, the application prefers to be run on a more powerful discrete GPU if available. |
| singleMainWindow | <code>string</code> | If true, the application has a single main window, and does not support having an additional one opened. |

<a name="WinRc"></a>

## WinRc : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| comments | <code>string</code> | Additional information that should be displayed for diagnostic purposes. |
| company | <code>string</code> | Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required. |
| fileDescription | <code>string</code> | File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required. |
| fileVersion | <code>string</code> | Version number of the file. For example, 3.10 or 5.00.RC2. This string is required. |
| internalName | <code>string</code> | Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required. |
| legalCopyright | <code>string</code> | Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional. |
| legalTrademark | <code>string</code> | Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional. |
| originalFilename | <code>string</code> | Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required. |
| privateBuild | <code>string</code> | Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block. |
| productName | <code>string</code> | Name of the product with which the file is distributed. This string is required. |
| productVersion | <code>string</code> | Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required. |
| specialBuild | <code>string</code> | Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block. |

<a name="App"></a>

## App : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| app | [<code>LinuxRc</code>](#LinuxRc) \| [<code>WinRc</code>](#WinRc) | Platform specific rc |

<a name="Options"></a>

## Options : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [srcDir] | <code>&quot;./&quot;</code> \| <code>string</code> | <code>&quot;./&quot;</code> | String of space separated glob patterns which correspond to NW app code |
| [mode] | <code>&quot;get&quot;</code> \| <code>&quot;run&quot;</code> \| <code>&quot;build&quot;</code> | <code>&quot;build&quot;</code> | Run or build application |
| [version] | <code>&quot;latest&quot;</code> \| <code>&quot;stable&quot;</code> \| <code>string</code> | <code>&quot;latest&quot;</code> | NW runtime version |
| [flavor] | <code>&quot;normal&quot;</code> \| <code>&quot;sdk&quot;</code> | <code>&quot;normal&quot;</code> | NW runtime build flavor |
| platform | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code> |  | NW supported platforms |
| arch | <code>&quot;ia32&quot;</code> \| <code>&quot;x64&quot;</code> \| <code>&quot;arm64&quot;</code> |  | NW supported architectures |
| [outDir] | <code>&quot;./out&quot;</code> \| <code>string</code> | <code>&quot;./out&quot;</code> | Directory to store build artifacts |
| [cacheDir] | <code>&quot;./cache&quot;</code> \| <code>string</code> | <code>&quot;./cache&quot;</code> | Directory to store NW binaries |
| [downloadUrl] | <code>&quot;https://dl.nwjs.io&quot;</code> \| <code>&quot;https://npmmirror.com/mirrors/nwjs&quot;</code> \| <code>&quot;https://npm.taobao.org/mirrors/nwjs&quot;</code> | <code>&quot;https://dl.nwjs.io&quot;</code> | URI to download NW binaries from |
| [manifestUrl] | <code>&quot;https://nwjs.io/versions&quot;</code> \| <code>string</code> | <code>&quot;https://nwjs.io/versions&quot;</code> | URI to download manifest from |
| app | [<code>App</code>](#App) |  | Multi platform configuration options |
| [cache] | <code>boolean</code> | <code>true</code> | If true the existing cache is used. Otherwise it removes and redownloads it. |
| [zip] | <code>boolean</code> | <code>false</code> | If true the outDir directory is zipped |
| [cli] | <code>boolean</code> | <code>false</code> | If true the CLI is used to glob srcDir and parse other options |
| [ffmpeg] | <code>boolean</code> | <code>false</code> | If true the chromium ffmpeg is replaced by community version |
| [glob] | <code>boolean</code> | <code>true</code> | If true globbing is enabled |

