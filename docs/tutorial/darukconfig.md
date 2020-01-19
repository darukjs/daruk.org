# daruk.config.ts

## 文件目录结构

通过上面的章节，我们知道，一个完整的项目包含了以下约定的目录结构:

```bash
./daruk-example/src
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

`app.ts`是  应用  的入口文件，通常代码如下：

```typescript
import daruk from "./daruk.init";

const port = process.env.PORT || 3000;

daruk.run(port, () => {
  daruk.logger.info(`服务已启动，访问 http://localhost:3000 查看效果`);
});

export default daruk;
```

为了在非约定目录能够方便地拿到 daruk 实例，我们通常选择在`daruk.init.ts`中初始化 daruk，然后在需要的地方能够直接`import`：

```typescript
import { Daruk } from "daruk";
const options = {};
export default new Daruk("myapp", options);
```

daruk 继承自 koa，比如有些中间件需要传递 koa 实例作为参数，我们直接传递 daruk 实例即可。

除了上述两个文件，剩下的文件和目录都是约定的（非必须），daruk 会主动去加载各个目录下的内容，然后挂载到 daruk 实例或者 koa 的 context 对象上。

约定目录中的内容初始化顺序是：`config -> daruk.config -> utils -> glues -> services -> middlewares -> controllers -> timers`

## daruk config

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
