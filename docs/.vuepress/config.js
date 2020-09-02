module.exports = {
  title: "Daruk",
  description: "Daruk, a typescript web framework.",
  base: "/",
  themeConfig: {
    logo: "/logo.png",
    logoLink: "https://github.com/darukjs/daruk",
    repo: "darukjs/daruk.org",
    editLinks: true,
    sidebarDepth: 2,
    docsDir: "docs",
    sidebar: [
      "/",
      {
        title: "教程",
        collapsable: false,
        children: [
          "tutorial/install",
          "tutorial/starup",
          "tutorial/decorator",
          "tutorial/lifecycle",
          "tutorial/deploy",
        ],
      },
      /*
      {
        title: "API 手册",
        collapsable: false,
        children: [
          "api/DarukServer",
          "api/darukContainer",
          "api/decorators",
          "api/TYPES",
        ],
      },
      */
      {
        title: " 周边插件",
        collapsable: false,
        children: ["ecological/performance"],
      },
    ],
  },
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  plugins: ["@vuepress/active-header-links"],
  ga: "UA-110549153-3",
};
