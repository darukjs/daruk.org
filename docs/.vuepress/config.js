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
      "./quick-start",
      "./decorator",
      "./api",
      "./lifecycle",
      {
        title: "性能",
        children: ["performance/performance", "performance/stress_testing"]
      }
    ]
  },
  head: [["link", { rel: "shortcut icon", href: "/logo.png" }]],
  plugins: ["@vuepress/active-header-links"]
};
