# 快速开始

我们认为约定目录结构是必要的，约定结构一方面能够统一团队项目结构风格；另一方面，在约定目录结构的基础上，我们能够做自动的 loader 以及初始化，减少模板代码，并且使模块甚至函数级别的性能分析成为可能。另外，装饰器语法能够减少代码量，并能够使代码更加清晰。因此，Daruk 采用了 `约定目录结构` + `装饰器` 的基调。

Daruk 只是在 Koa 上做了一定的约定并添加了部分方便的功能，所以不管是开发时以及运行时，都和 Koa 相差无几。也正因为此，这篇文档并不会过多地介绍 Koa 的基础概念，需要读者对 Koa 有一定的了解。Daruk 推荐使用 [Typescript](https://www.tslang.cn/docs/home.html) 来开发，建议先对 Typescript 稍作了解；另外，也建议了解 Typescript 的[装饰器](https://www.tslang.cn/docs/handbook/decorators.html)，简单来说，装饰器就是一种特殊的语法，它允许我们对类做修改、在类上保存信息，从而提高代码的抽象性，便于管理依赖。

## 快速使用

使用 `Daruk` 官方脚手架一键生成项目

```bash
# 全局安装daruk脚手架
cnpm i -g daruk-cli

# 初始化项目
# --ignore 表示忽略本地模板缓存
daruk init --ignore daruk-example

# 运行项目
cd daruk-example
npm run dev
```

现在你已经可以使用 Daruk 快速搭建一个应用了.
