module.exports = {
  title: "Daruk",
  description: "Daruk, a typescript web framework.",
  base: "/",
  theme: "antdocs",
  themeConfig: {
    logo: "/logo.png",
    logoLink: "https://github.com/darukjs/daruk",
    repo: "darukjs/daruk",
    editLinks: false,
    sidebarDepth: 2,
    docsDir: "docs",
    nav: [
      { text: "首页", link: "/" },
      { text: "教程", link: "/tutorial/install.html" },
      { text: "API", link: "https://doc.darukjs.com", target: "_blank" },
    ],
    sidebar: [
      {
        title: "教程",
        collapsable: false,
        children: [
          "tutorial/about",
          "tutorial/install",
          "tutorial/starup",
          "tutorial/decorator",
          "tutorial/lifecycle",
          "tutorial/deploy",
        ],
      },
      {
        title: " 周边插件",
        collapsable: false,
        children: ["ecological/performance"],
      },
    ],
  },
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  plugins: {
    "@vuepress/active-header-links": {
      sidebarLinkSelector: ".sidebar-link",
      headerAnchorSelector: ".header-anchor",
    },
    "@vuepress/last-updated": {
      transformer: (timestamp, lang) => {
        // 不要忘了安装 moment
        const moment = require("moment");
        moment.locale(lang);
        return moment(timestamp).fromNow();
      },
    },
  },
  ga: "UA-110549153-3",
};
