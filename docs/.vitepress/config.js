export default {
  title: "Build NW.js apps",
  themeConfig: {
    siteTitle: "nw-builder",
    base: "/nw-builder/",
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
  },
};
