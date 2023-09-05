import { defineConfig } from "vitepress";

export default defineConfig({
  title: "nw-builder",
  description: "Build NW.js applications",
  base: "/nw-builder/",
  themeConfig: {
    nav: [
      { text: "NW.js Utils", link: "https://nwutils.io/" },
      { text: "npm", link: "https://www.npmjs.com/package/nw-builder" },
      {
        text: "Changelog",
        link: "https://github.com/nwutils/nw-builder/blob/main/changelog.md",
      },
      { text: "Contributing", link: "./contributing" },
      {
        text: "Code of Conduct",
        link: "https://github.com/nwutils/.github/blob/main/CODE_OF_CONDUCT.md",
      },
      { text: "License", link: "./license" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsible: true,
        items: [
          { text: "Installation Guide", link: "/install" },
          { text: "Basic Usage", link: "/usage-basic" },
          { text: "Get NW.js mode", link: "/mode-get-nwjs" },
          { text: "Get FFmpeg mode", link: "/mode-get-ffmpeg" },
          { text: "Run mode", link: "/mode-run" },
          { text: "Build mode", link: "/mode-build" },
          { text: "API Reference", link: "/api" },
          {
            text: "Linux Specific Options",
            link: "/api-nux.html#linuxrc-object",
          },
          {
            text: "Windows Specific Options",
            link: "/api-win.md#winrc-object",
          },
          {
            text: "MacOS Specific Options",
            link: "/api-osx.md#osxrc-object",
          },
        ],
      },
      {
        text: "Migration Guide",
        collapsible: true,
        items: [{ text: "Migrate from v3 to v4", link: "./migrate-v3-v4" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/nwutils/nw-builder" },
    ],
  },
});
