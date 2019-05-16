# Daruk 和 Koa 的区别

Daruk 是对 Koa2 的更上一层封装，对路由层，ctx，web 服务的生命周期，以及 web 项目所需要的配置项，抽象层以及 middleware 的加载都进行了配置和规范，用于帮助开发者写出更好维护和质量更高的 web 项目，最后再配套一些非常常见的基础 web 功能组件,全部这些就组成了 Daruk。

为了方便大家快速上手 Daruk ,我们提供了一个 ts 项目的脚手架，方便大家初始化和学习 Daruk 代码，通过 daruk cli 安装：

```bash
$ daruk init my-project 'darukjs/daruk-template#nodejs-ts-scaffold'
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

下面是一个常见的 Koa 服务代码:

```js
// index.js
const Koa = require("koa");
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000);
```

转换成 Daruk 编写的例子如下：

```bash
# 首先安装daruk
yarn add daruk
```

```ts
// src/index.ts
import { Daruk } from "daruk";

let app = new Daruk("myapp", {
  rootPath: __dirname,
  debug: true // 开启调试模式
});

app.listen(3000);
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
