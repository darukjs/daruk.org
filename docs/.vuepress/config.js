module.exports = {
  title: "Daruk",
  description: "Daruk, a typescript web framework.",
  base: "/daruk.org/",
  themeConfig: {
    logo: "/logo.png",
    logoLink: "https://github.com/daruk-framework/daruk",
    repo: "daruk-framework/daruk.org",
    editLinks: true,
    docsDir: "docs",
    sidebar: [
      "/",
      {
        title: "教程",
        children: [
          "tutorial/install",
          "tutorial/about",
          "tutorial/typescript",
          "tutorial/different",
          "tutorial/scaffolding",
          "tutorial/quick-start",
          "tutorial/specification",
          "tutorial/lifecycle",
          "tutorial/darukconfig",
          "tutorial/projectConfig",
          "tutorial/decorator",
          "tutorial/router",
          "tutorial/middleware",
          "tutorial/service",
          "tutorial/gule",
          "tutorial/util",
          "tutorial/timer",
          "tutorial/culster",
          "tutorial/logger",
          "tutorial/performance",
          "tutorial/extension",
          "tutorial/pm2"
        ]
      },
      {
        title: "框架原理",
        children: [
          "principle/core",
          "principle/decorator",
          "principle/routing",
          "principle/diagram"
        ]
      },
      {
        title: "api",
        children: ["api/api"]
      },
      {
        title: "更多",
        children: ["more/compare", "more/team"]
      }
    ]
  },
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  plugins: ["@vuepress/active-header-links"]
};
