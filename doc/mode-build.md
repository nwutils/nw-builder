## Functions

<dl>
<dt><a href="#build">build(files, nwDir, outDir, platform, zip, app)</a> ⇒ <code>Promise.&lt;undefined&gt;</code></dt>
<dd><p>Generate NW build artifacts</p>
<p>Note: File permissions are incorrectly set for Linux or MacOS apps built on Windows platform. For more info: <a href="https://www.geeksforgeeks.org/node-js-fs-chmod-method">https://www.geeksforgeeks.org/node-js-fs-chmod-method</a></p>
<p>Note: To edit Windows executable resources, we use <a href="https://github.com/electron/node-rcedit"><code>rcedit</code></a>. To use rcedit on non-Windows platforms, you will have to install <a href="https://www.winehq.org/">Wine</a>.</p>
<p>Note: We recursively glob the file patterns given by the user. The first <code>package.json</code> parsed is taken to be the NW.js manifest file. If you have multiple manifest files, the first glob pattern should be the path to the NW.js manifest. Choosing a Node manifest at <code>./package.json</code> is the most convenient option.</p>
<p>Note: If you are using the MacOS ARM unofficial builds, you will need to <a href="https://github.com/corwin-of-amber/nw.js/releases/tag/nw-v0.75.0">remove the <code>com.apple.qurantine</code> flag</a>:</p>
<p><code>sudo xattr -r -d com.apple.quarantine nwjs.app</code></p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LinuxRc">LinuxRc</a> : <code>object</code></dt>
<dd><p>References:
<a href="https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html">https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html</a></p>
</dd>
<dt><a href="#OsxRc">OsxRc</a> : <code>object</code></dt>
<dd><p>References:
<a href="https://developer.apple.com/documentation/bundleresources/information_property_list">https://developer.apple.com/documentation/bundleresources/information_property_list</a></p>
</dd>
<dt><a href="#WinRc">WinRc</a> : <code>object</code></dt>
<dd><p>References:
<a href="https://learn.microsoft.com/en-us/windows/win32/msi/version">https://learn.microsoft.com/en-us/windows/win32/msi/version</a>
<a href="https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests">https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests</a>
<a href="https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel">https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel</a>
<a href="https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource">https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource</a></p>
</dd>
</dl>

<a name="build"></a>

## build(files, nwDir, outDir, platform, zip, app) ⇒ <code>Promise.&lt;undefined&gt;</code>

Generate NW build artifacts

Note: File permissions are incorrectly set for Linux or MacOS apps built on Windows platform. For more info: https://www.geeksforgeeks.org/node-js-fs-chmod-method

Note: To edit Windows executable resources, we use [`rcedit`](https://github.com/electron/node-rcedit). To use rcedit on non-Windows platforms, you will have to install [Wine](https://www.winehq.org/).

Note: We recursively glob the file patterns given by the user. The first `package.json` parsed is taken to be the NW.js manifest file. If you have multiple manifest files, the first glob pattern should be the path to the NW.js manifest. Choosing a Node manifest at `./package.json` is the most convenient option.

Note: If you are using the MacOS ARM unofficial builds, you will need to [remove the `com.apple.qurantine` flag](https://github.com/corwin-of-amber/nw.js/releases/tag/nw-v0.75.0):

`sudo xattr -r -d com.apple.quarantine nwjs.app`

**Kind**: global function

| Param    | Type                                                                                             | Description                                     |
| -------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| files    | <code>string</code> \| <code>Array.&lt;string&gt;</code>                                         | Array of NW app files                           |
| nwDir    | <code>string</code>                                                                              | Directory to hold NW binaries                   |
| outDir   | <code>string</code>                                                                              | Directory to store build artifacts              |
| platform | <code>&quot;linux&quot;</code> \| <code>&quot;osx&quot;</code> \| <code>&quot;win&quot;</code>   | Platform is the operating system type           |
| zip      | <code>&quot;zip&quot;</code> \| <code>boolean</code>                                             | Specify if the build artifacts are to be zipped |
| app      | [<code>LinuxRc</code>](#LinuxRc) \| [<code>OsxRc</code>](#OsxRc) \| [<code>WinRc</code>](#WinRc) | Multi platform configuration options            |

**Example**

```js
// Minimal Usage (uses default values)
nwbuild({
  mode: "build",
});
```

<a name="LinuxRc"></a>

## LinuxRc : <code>object</code>

References:
https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html

**Kind**: global typedef  
**Properties**

| Name                 | Type                              | Description                                                                                                                                                                                                                          |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                 | <code>string</code>               | Name of the application                                                                                                                                                                                                              |
| genericName          | <code>string</code>               | Generic name of the application                                                                                                                                                                                                      |
| noDisplay            | <code>boolean</code>              | If true the application is not displayed                                                                                                                                                                                             |
| comment              | <code>string</code>               | Tooltip for the entry, for example "View sites on the Internet".                                                                                                                                                                     |
| icon                 | <code>string</code>               | Icon to display in file manager, menus, etc.                                                                                                                                                                                         |
| hidden               | <code>boolean</code>              | TBD                                                                                                                                                                                                                                  |
| onlyShowIn           | <code>Array.&lt;string&gt;</code> | A list of strings identifying the desktop environments that should (/not) display a given desktop entry                                                                                                                              |
| notShowIn            | <code>Array.&lt;string&gt;</code> | A list of strings identifying the desktop environments that should (/not) display a given desktop entry                                                                                                                              |
| dBusActivatable      | <code>boolean</code>              | A boolean value specifying if D-Bus activation is supported for this application                                                                                                                                                     |
| tryExec              | <code>string</code>               | Path to an executable file on disk used to determine if the program is actually installed                                                                                                                                            |
| exec                 | <code>string</code>               | Program to execute, possibly with arguments.                                                                                                                                                                                         |
| path                 | <code>string</code>               | If entry is of type Application, the working directory to run the program in.                                                                                                                                                        |
| terminal             | <code>boolean</code>              | Whether the program runs in a terminal window.                                                                                                                                                                                       |
| actions              | <code>Array.&lt;string&gt;</code> | Identifiers for application actions.                                                                                                                                                                                                 |
| mimeType             | <code>Array.&lt;string&gt;</code> | The MIME type(s) supported by this application.                                                                                                                                                                                      |
| categories           | <code>Array.&lt;string&gt;</code> | Categories in which the entry should be shown in a menu                                                                                                                                                                              |
| implements           | <code>Array.&lt;string&gt;</code> | A list of interfaces that this application implements.                                                                                                                                                                               |
| keywords             | <code>Array.&lt;string&gt;</code> | A list of strings which may be used in addition to other metadata to describe this entry.                                                                                                                                            |
| startupNotify        | <code>boolean</code>              | If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all. |
| startupWMClass       | <code>string</code>               | If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin                                                                                                     |
| prefersNonDefaultGPU | <code>boolean</code>              | If true, the application prefers to be run on a more powerful discrete GPU if available.                                                                                                                                             |
| singleMainWindow     | <code>string</code>               | If true, the application has a single main window, and does not support having an additional one opened.                                                                                                                             |

<a name="OsxRc"></a>

## OsxRc : <code>object</code>

References:
https://developer.apple.com/documentation/bundleresources/information_property_list

**Kind**: global typedef  
**Properties**

| Name                       | Type                | Description                                                          |
| -------------------------- | ------------------- | -------------------------------------------------------------------- |
| name                       | <code>string</code> | The name of the application                                          |
| icon                       | <code>string</code> | The path to the icon file. It should be a .icns file.                |
| LSApplicationCategoryType  | <code>string</code> | The category that best describes your app for the App Store.         |
| CFBundleIdentifier         | <code>string</code> | A unique identifier for a bundle usually in reverse DNS format.      |
| CFBundleName               | <code>string</code> | A user-visible short name for the bundle.                            |
| CFBundleDisplayName        | <code>string</code> | The user-visible name for the bundle.                                |
| CFBundleSpokenName         | <code>string</code> | A replacement for the app name in text-to-speech operations.         |
| CFBundleVersion            | <code>string</code> | The version of the build that identifies an iteration of the bundle. |
| CFBundleShortVersionString | <code>string</code> | The release or version number of the bundle.                         |
| NSHumanReadableCopyright   | <code>string</code> | A human-readable copyright notice for the bundle.                    |

<a name="WinRc"></a>

## WinRc : <code>object</code>

References:
https://learn.microsoft.com/en-us/windows/win32/msi/version
https://learn.microsoft.com/en-gb/windows/win32/sbscs/application-manifests
https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel
https://learn.microsoft.com/en-gb/windows/win32/menurc/versioninfo-resource

**Kind**: global typedef  
**Properties**

| Name             | Type                | Description                                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | <code>string</code> | The name of the application                                                                                                                                                                                                                                                                       |
| version          | <code>string</code> | The version of the application                                                                                                                                                                                                                                                                    |
| comments         | <code>string</code> | Additional information that should be displayed for diagnostic purposes.                                                                                                                                                                                                                          |
| company          | <code>string</code> | Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required.                                                                                                                                                             |
| fileDescription  | <code>string</code> | File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required.                                                                                   |
| fileVersion      | <code>string</code> | Version number of the file. For example, 3.10 or 5.00.RC2. This string is required.                                                                                                                                                                                                               |
| icon             | <code>string</code> | The path to the icon file. It should be a .ico file.                                                                                                                                                                                                                                              |
| internalName     | <code>string</code> | Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required.                                                             |
| legalCopyright   | <code>string</code> | Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional.                                                                                                                                   |
| legalTrademark   | <code>string</code> | Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional.                                                                                                              |
| originalFilename | <code>string</code> | Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required.                                       |
| privateBuild     | <code>string</code> | Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block.                                                                                   |
| productName      | <code>string</code> | Name of the product with which the file is distributed. This string is required.                                                                                                                                                                                                                  |
| productVersion   | <code>string</code> | Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required.                                                                                                                                                                                 |
| specialBuild     | <code>string</code> | Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block. |
