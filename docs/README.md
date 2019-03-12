# 开始

我们认为约定目录结构是必要的，约定结构一方面能够统一团队项目结构风格；另一方面，在约定目录结构的基础上，我们能够做自动的 loader 以及初始化，减少模板代码，并且使模块甚至函数级别的性能分析成为可能。另外，装饰器语法能够减少代码量，并能够使代码更加清晰。因此，Daruk 采用了 `约定目录结构` + `装饰器` 的基调。

另外 Daruk 只是在 Koa 上做了一定的约定并添加了部分方便的功能，所以不管是开发时以及运行时，都和 Koa 相差无几。也正因为此，这篇文档并不会过多地介绍 Koa 的基础概念，需要读者对 Koa 有一定的了解。

相关文档：

[Daruk 装饰器](./features/decorator.md)  
[Daruk API 文档](./api.md)  
[Daruk 生命周期](./lifecycle.md)  
[Daruk Middleware 文档](./features/middleware.md)  
[Daruk 性能监控文档](./performance/performance.md)  
[Daruk 压测报告](./performance/stress_testing.md)  

## 快速使用

使用 `Daruk` 官方脚手架一键生成项目
```bash
# 全局安装daurk脚手架
cnpm i -g daruk-cli

# 初始化项目
# -i 参数是 ignore 的缩写，表示忽略本地缓存
daruk init -i daruk-example

# 运行项目
cd daruk-example
npm run dev
```

## 文件目录结构

Daruk使用约定的目录结构来将应用划分为各个部分：  

```bash
daruk-example
src
├── app.ts
├── daruk.config.ts
├── daruk.init.ts
├── config
│   └── index.ts
├── controllers
│   ├── contact
│   │   ├── index.ts
│   │   └── list.ts
│   ├── index.ts
│   └── user.ts
├── middlewares
│   └── koa-test-mid.ts
├── services
│   └── UserInfo.ts
├── glues
│   └── mysql
│       ├── connect.ts
│       └── index.ts
├── timers
│   └── myTimer.ts
├── utils
│   └── index.ts
├── public
│   └── daruk.png
```

`app.ts`是应用的入口文件，通常代码如下：

```typescript
import daruk from './daruk.init.ts'
daruk.run(3000)
```

为了在非约定目录能够方便地拿到 daruk 实例，我们通常选择在`daruk.init.ts`中初始化 daruk，然后在需要的地方能够直接```import```：

```typescript
import {Daruk} from 'daruk'
const options = {}
export default new Daruk('myapp', options)
```

daruk 继承自 koa，比如有些中间件需要传递 koa 实例作为参数，我们直接传递 daruk 实例即可。

除了上述两个文件，剩下的文件和目录都是约定的（非必须），daruk 会主动去加载各个目录下的内容，然后挂载到 daruk 实例或者 koa 的 context 对象上。

约定目录中的内容初始化顺序是：`config -> daruk.config -> utils -> glues -> services -> middlewares -> controllers -> timers`

### daruk.config.ts

`daruk.config.ts` 是对约定目录的补充，使你能够不通过约定目录，就能向 daruk 挂载内容。通常内容如下：

```typescript
// src/daruk.config.ts
export default function () {
  const darukConfig:any = {}
  // 定义中间件执行顺序
  darukConfig.middlewareOrder = ['koa2-cors', 'daurk-test-middleware']
  // 定义中间件
  // darukConfig.middleware 对象的 key 即是用在 middlewareOrder 中的中间件名字
  darukConfig.middleware = {
    // key 即是中间件包名，也是中间件的名字
    // 值为一个函数，函数需要返回中间件的内容
    'koa2-cors': function (mid: Function) {
      // mid 变量就是通过包名加载到的中间件的内容
      return mid({
        "allowMethods": ['GET', 'POST', 'DELETE']
      })
    }
    // 分别指定中间件的名字和包名
    'my-middleware': {
      packet: 'koa-body',
      // 在 export 函数中返回中间件的内容
      export: function (mid: Function) {
        return mid()
      }
    }
  }
  // 直接在 daruk.util、ctx.util 上定义一些方法
  darukConfig.util = {
		"testUtil": function () {},
  }
  // 直接定义定时器配置
  darukConfig.timer = {
    testTimer: {...}
  }

  // 最后需要 return 配置
  return darukConfig
}

```

## config  

`config` 目录用于定义项目的配置，config 目录中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数的返回值就是项目的配置，然后就可以在各个地方通过 `daruk.config`、`ctx.config` 访问了。

```typescript
// src/config/index.ts

// 其他内容省略...
export default function (daruk) {
  return config
}
```

## controllers 

很多情况下，路由的存在是为了将请求对应到controller层处理我们采用 controller 定义即路由定义的约定。daruk 会递归读取 controllers 目录下的文件，以文件名作为路由 path，特别的，`index.ts` 代表的 path 是 `/`，然后再配合装饰器来定义路由的 http method。所有的 controller 文件都需要导出 Daruk.BaseController 的子类，在该类中可以通过 this.app 访问 daurk 实例，通过 this.ctx 访问 context。

比如我们添加一个 `GET /contact/list` 路由：

```typescript
// src/controllers/contact/list.ts
import { BaseController, get, Context } from 'daruk'

export default class ContactList extends BaseController {
  @get('/')
  public async getContactList (ctx: Context, next: Function) {
    ctx.body = 'contact list'
    return next()
  }
}
```

所有的 http method 都有对应的装饰器，比如 `@get`、`@post`、`@put`、`@options` 等。

路由装饰器可以接受一个字符串参数，用于进一步指定路由的 path，比如要实现上面的 `GET /contact/list` 路由，我们可以这样写：

```typescript
// 注意，删除了 src/controllers/contact 目录，直接在 contact.ts 中定义路由
// scr/controllers/contact.ts
import { BaseController, get, Context } from 'daruk'

export default class Contact extends BaseController {
  @get('/list')
  public async getContactList (ctx: Context, next: Function) {
    ctx.body = 'contact list'
    return next()
  }
}
```

另外需要注意，每次用户请求时，对应的 controller 都会实例化，因此不要在 controller 类的 constructor 中执行复杂操作。 其实一般不需要定义 constructor，如果定义了，必须像下面这样执行 super：

```typescript
// scr/controllers/contact.ts
import { BaseController, get, Context } from 'daruk'

export default class Contact extends BaseController {
  public constructor (ctx: Context) {
    super(ctx)
  }
}
```

## middlewares 

daruk 会以 middlewares 目录下的第一级文件夹名字或者文件名作为 middleware 的名字（middleware的名字用于在 middlewareOrder 中定义中间件执行顺序）。比如通过下面的目录结构，会得到 middleware1、middleware2 两个中间件。注意，文件夹里，需要存在 index.ts 文件。

```bash
middlewares
├── middleware1.ts
├── middleware2
|   ├── index.ts
|   ├── someLogic.ts
```

中间件`文件`或者`文件夹`中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数的返回值就是中间件的内容：

```typescript
// middlewares/middleware1.ts
import { Daruk, Context } from 'daruk'

export default function (daruk: Daruk) {
  return async function (ctx: Context, next: Function) {
    // do something
    return next()
  }
}
```

### 中间件的使用

在注册中间件后，我们需要用 `middlewareOrder` 声明中间件的调用顺序   
中间件注册后不一定会被使用，只有在 `middlewareOrder` 中声明的中间件才会被调用

```typescript
// src/daruk.config.ts
module.exports = function () {
  const globalConfig:any = {}

  globalConfig.middlewareOrder = [
    'middleware1',
    'middleware2',
  ]

  return globalConfig
}
```

## services 

简单来说，Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层，提供这个抽象有以下几个好处：

- 保持 Controller 中的逻辑更加简洁。
- 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
- 将逻辑和展现分离，更容易编写测试用例。

使用场景：

- 复杂数据的处理，比如要展现的信息需要从数据库获取，还要经过一定的规则计算，才能返回用户显示。或者计算完成后，更新到数据库。
- 第三方服务的调用，比如 处理ioredis等。

与 middleware 类似，daruk 也会以 services 目录下的第一级文件夹名字或者文件名作为 service 的名字。比如通过下面的目录结构会得到 service1、service2 两个 service。

```bash
services
├── service1.ts
├── service2
|   ├── index.ts
|   ├── someLogic.ts
```

service `文件`或者`文件夹`中的 index.ts 需要导出 Daruk.BaseService 的子类，在该类中可以通过 this.app 访问 daurk 实例，通过 this.ctx 访问 context：

```ts
// src/services/userInfo.ts
import { BaseService } from 'daruk'

export default class UserInfo extends BaseService {
  public getUserList () {
    const { mysql } = this.ctx.glue
    return mysql.queryUserList()
  }
}
```

### service 的使用

service 会以遍历到的文件夹或文件名作为 key 自动挂载到 ctx.service 上。

注意，只能通过 ctx.service 访问 service，不能通过 daruk.service 访问，因为 service 应该是和请求链路绑定的，只能在请求链路中调用，通常是在 controller 中调用，如果没有请求到达服务器，不应该手动调用 service。

在 controller 中使用 service：

```typescript
// src/controllers/user.ts
import { BaseController, get } from 'daruk'

export default class User extends BaseController {
  @get('/')
  public async index () {
    const { userInfo } = this.ctx.service
    // do something
  }
}
```

另外需要注意，每次用户请求时，被调用的 service 都会实例化，因此不要在 service 类的 constructor 中执行复杂操作。 其实一般不需要定义 constructor，如果定义了，必须像下面这样执行 super：

```typescript
// src/controllers/user.ts
import { BaseController,  Context, get } from 'daruk'

export default class User extends BaseController {
  public constructor (ctx: Context) {
    super(ctx)
  }
}
```

## glues 

不管 middleware、controller 或者是 service，都是与用户的访问链路相关的，但我们希望做一些与链路无关的操作，比如连接数据库、进程退出报警等操作。这些操作可以选择放到 glues 目录。

glues 目录的扫描规则和 middlewares、services 目录相同，以第一级目录的文件名或者目录名作为 key，将 glues 导出的内容挂载到 daruk.glue 和 ctx.glue 上。比如下面的目录结构会得到 `daruk.glue.mysql`、`ctx.glue.mysql`

```bash
── glues
|	├── mysql
│   ├── index.ts
│   ├── connect.ts
```

glues 目录下的文件或者文件夹中的 index.ts 需要导出一个函数，函数的返回值就是 glues 的内容，函数的参数是 daruk 实例：

```ts
// src/glues/mysql/index.ts
import { Daruk } from 'daruk'
import mysql from './connect'

export default function (daruk: Daruk) {
  return mysql
}
```

## utils

utils 目录用于定义一些工具方法，daurk 会挂载 utils 到 daurk.util 和 ctx.util。daurk 不限制 utils 的目录结构，只需要在 index.ts 导出 utils 的内容就行了。

```ts
// src/utils/index.ts
import { Daruk } from 'daruk'

export default function (daruk: Daruk) {
  return utils
}
```

## timers（定时任务）

在实际应用中，我们有很多时候需要依赖定时任务来解决问题，例如：

1. 定时检测机器状态，性能
2. 定时更新缓存

类似的，daurk 会以 timers 下文件夹名字或者文件的名字作为 timer 的名字。文件或者文件夹中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数需要返回 timer 的配置：

```ts
export default function () {
  return {
      cronTime: '* * * * * *', //一秒一次
      // 定时器触发的回调
      onTick: function (this: any) {
        // 可以手动停止定时器
        this.stop();
      },
      // 定时器完成的回调
      onComplete: function () {}
  }
}
```