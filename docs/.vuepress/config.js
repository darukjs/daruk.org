module.exports = {
  title: 'Daruk',
  description: 'daruk 文档',
  base: '/daruk.org/',
  themeConfig: {
    logo: '/logo.png',
    logoLink: 'https://github.com/daruk-framework',
    repo: 'daruk-framework/daruk.org',
    editLinks: true,
    docsDir: 'docs',
    sidebar: [
      '/',
      // {
      //   title: '简介',
      //   children: [
      //     'doctor/preface'
      //   ]
      // }
    ]
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/logo.png' }]
  ]
}