module.exports = {
  title: "Daruk",
  description: "Daruk, a typescript web framework.",
  base: "/",
  themeConfig: {
    logo: "/logo.png",
    logoLink: "https://github.com/darukjs/daruk",
    repo: "darukjs/daruk.org",
    editLinks: true,
    docsDir: "docs",
    sidebar: [
      "/",
      {
        title: "教程",
        children: [
          "tutorial/install",
          "tutorial/about",
          "tutorial/starup",
          "tutorial/controller",
          "tutorial/service",
          "tutorial/middleware",
          "tutorial/module",
          "tutorial/plugin",
          "tutorial/timer",
          "tutorial/decorator",
          "tutorial/deploy",
        ],
      },
      {
        title: "API 手册",
        children: ["api/api"],
      },
      {
        title: " 周边插件",
        children: [
          "ecological/plugin",
          "ecological/logger",
          "ecological/performance",
        ],
      },
    ],
  },
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  plugins: ["@vuepress/active-header-links"],
  ga: "UA-110549153-3",
};
