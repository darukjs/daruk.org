# 介绍

## 什么是 Daruk?

[Daruk](https://daruk-framework.github.io/daruk.org) 是一款基于 [Koa](https://github.com/koajs/koa)，使用 [Typescript](https://www.typescriptlang.org/) 开发的轻量级 web 框架。使用过 koa2 框架的朋友应该知道，koa2 属于比较原始和基础的 http server 实现，在日常的开发工作中，我们可能需要通过安装很多开源的中间件，自己完成复杂的项目配置，路由管理，以及和业务无关的工作：如日志，监控，性能等基础组件的定制。

有了 Daruk，我们可以轻松地一键初始化你的 web 项目，快速的编写业务代码。Daruk 的目的就是轻量和易扩展，新增的概念少，上手难度低，核心代码也不多，但是可以提供给开发者更多的灵活选择，快速完成业务开发，约束项目规范和代码格式。

Daruk 来源自塞尔达传说旷野之息里的四英杰之一，拥有在周围张开结界保护自己的力量，框架的目的也是为了给 nodejs server 提供健壮的基础管理能力。

Daruk 基于 koa2，包含以下核心功能：

- 一键生成项目，开箱即用
- 合理和克制的分层目录结构
- 自动 loader 与装饰器结合的机制
- 完整的 typescript 开发体验
- 服务启动完整声明周期 hook
- 自定义(性能日志 & 业务日志) 染色功能
- 支持线上实时性能分析
- 轻量级的链路追踪
- 面向对象的 mvc 开发体验
- 配套的一些周边模块

## Daruk 和 Koa 的区别

Daruk 是对 Koa2 的更上一层封装，对路由层，ctx，web 服务的生命周期，以及 web 项目所需要的配置项，抽象层以及 middleware 的加载都进行了配置和规范，用于帮助开发者写出更好维护和质量更高的 web 项目，最后再配套一些非常常见的基础 web 功能组件,全部这些就组成了 Daruk。

为了方便大家快速上手 Ts，Daruk 也提供了一个 ts 项目的脚手架，方便大家初始化和学习 Daruk 代码，通过 daruk cli 安装：

```bash
$ daruk init my-project 'daruk-framework/daruk-template#nodejs-ts-scaffold'
$ tree -L 1

├── README.md
├── node_modules
├── package.json
├── prettier.config.js
├── src # ts 工程目录,index.ts为入口文件
├── tests
├── tsconfig.json
├── tslint.json
├── typings
└── yarn.lock

$ npm run dev # 可以调试ts代码，我们下面就从这个工程里开始学习daruk
```

下面是一个 Koa 转换成 Daruk 编写的例子：

```js
// index.js
const Koa = require("koa");
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000);
```

Daruk 的写法：

```bash
# 首先安装daruk
yarn add daruk
```

```ts
// src/index.ts
import { Daruk } from "daruk";

let app = new Daruk("myapp", {
  rootPath: __dirname,
  debug: true
});

app.run(3000);
```

```ts
// src/controllers/index.ts
import { BaseController, Context, get } from "daruk";
export default class Index extends BaseController {
  @get("/")
  public async index(ctx: Context, next: Function) {
    ctx.body = "Hello world";
  }
}
```

```bash
# 控制台输出
npm run dev

> NODE_ENV=dev nodemon --exec ts-node --files ./src/index.ts

[nodemon] 1.18.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `ts-node --files ./src/index.ts`
[2019-4-26 14:58:56] [debug] [init] [config]
[2019-4-26 14:58:56] [debug] [init] [middleware] []
[2019-4-26 14:58:56] [debug] [init] [router] get - /
[2019-4-26 14:58:56] [debug]  myapp is starting at http://localhost:3000
```

通过 Daruk 我们可以很自然的解耦之前 Koa 的面条式代码，并通过目录约定和 auto load 功能进行了 controller 加载和初始化。

查看 Daruk 文档[快速开始](./quick-start)吧！
