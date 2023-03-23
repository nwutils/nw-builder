import { defineConfig } from "vitepress";

export default defineConfig({
  title: "nw-builder",
  description: "Build NW.js applications",
  themeConfig: {
    nav: [
      { text: "npm", link: "https://www.npmjs.com/package/nw-builder" },
      { text: "NW.js Utils", link: "https://nwutils.io/" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsible: true,
        items: [
          { text: "Installation Guide", link: "/install" },
          { text: "Basic Usage", link: "/usage-basic" },
          { text: "Get mode", link: "/mode-get" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/nwutils/nw-builder" },
    ],
  },
});
