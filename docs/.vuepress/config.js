module.exports = {
  title: 'Daruk',
  description: 'daruk 文档',
  base: '/daruk.org/',
  themeConfig: {
    logo: '/logo.png',
    logoLink: 'https://github.com/daruk-framework/daruk',
    repo: 'daruk-framework/daruk',
    editLinks: true,
    docsDir: 'docs',
    sidebar: [
      '/',
      '/quick-start',
      {
        title: '功能',
        children: [
          'features/middleware',
          'features/decorator',
        ]
      },
      {
        title: '性能',
        children: [
          'performance/performance',
          'performance/stress_testing',
        ]
      },
      './api',
      './lifecycle'
    ]
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/logo.png' }]
  ],
  plugins: ['@vuepress/active-header-links']
}