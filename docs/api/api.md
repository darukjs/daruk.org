# API

## Daruk

_new Daruk(name: string, options: darukOptions)_

##### Parameters:

> name: **string** Daruk app 实例名称
>
> options: **darukOptions** 提供 Daruk 的目录名称

| 选项                             | 默认值              | 描述                          | 其他                                                     |
| -------------------------------- | ------------------- | ----------------------------- | -------------------------------------------------------- |
| options.debug                    | false               | 是否是 debug 模式             | -                                                        |
| options.loggerOptions            | 同 daruk-logger     | logger 配置                   | https://github.com/daruk-framework/daruk-logger          |
| options.customLogger             | null                | 自定义 logger                 | 需要实现 daruk-logger 类似的接口                         |
| options.gracefulShutdown.enable  | false               | 是否开启优雅关机              | docker 已经根据 nginx 是否存在连接做了优雅关机，默认关闭 |
| options.gracefulShutdown.timeout | 10\*1000            | 关机超时                      | -                                                        |
| options.monitor.enable           | false               | 是否开启 v8 profiler 监控路由 | -                                                        |
| options.monitor.v8AnalyticsPath  | 'v8-analytics'      | v8Analytic 安装路径           | -                                                        |
| options.monitor.v8ProfilerPath   | 'v8-profiler-node8' | v8Profiler 安装路径           | -                                                        |
| options.monitor.auth.name        | ''                  | 访问监控路由的用户名          | -                                                        |
| options.monitor.auth.password    | ''                  | 访问监控路由的密码            | -                                                        |

Daruk 实例包含下列方法:
#### _#listen(...)_

##### Desc: 启动 http服务,该方法是对Koa的app.listen的一次封装，调用方式一致,文档参考：

https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback

```typescript
let daruk = require("daruk");
let app = daruk("myapp");
app.listen(3030);
```


#### _#run(port:number|string, host?:string|Function, cb?:Function)_

##### Desc: 启动 http 服务

##### Parameters:

> port: **string|number** 端口号
>
> host: **string|Function** 启动的 host 或者成功的回调
>
> cb: **Function** 成功的回调

##### Example:

```typescript
let daruk = require("daruk");
let app = daruk("myapp");
app.run(3030, "0.0.0.0", () => {});
```

#### _#serverReady(server: Http.server | Https.server)_

##### Desc: 服务启动后需要调用的函数，以完成剩余操作。用于不调用 run 方法的自定义启动

##### Parameters:

> server: Http.createServer（或 Https.createServer） 的返回值

##### Example:

```typescript
// 调用 run 方法只能启动 http 服务
// https 服务需要自定义启动
// 类似于 koa 启动 https  服务
// https://github.com/koajs/koa/issues/960

import fs = require("fs");
import https = require("https");
import path = require("path");
import daruk from "./daruk.init";

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "./certificate/private.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "./certificate/ca.cer"))
};
const server = https.createServer(options, daruk.callback());

server.listen(3000, () => {
  daruk.serverReady(server);
  console.log(`server is starting at https://localhost:3000`);
});
```

#### _#mockContext(req?: {})_

##### Desc: 用于在非请求链路中得到一个模拟的 Context 对象

##### Parameters:

> req: **{ [key: string]: any }** 模拟的 request 对象

##### Return: Context

##### Example:

```typescript
const ctx = darukInstance.mockContext();
ctx.service.userInfo.getUserList();
```

## register

daruk 会按照约定的目录加载 middleware、controller、service 等，不过 daruk 也提供了编程式 api 接口，允许用户手动注册这些内容。这些 api 都采用统一形式的参数，以注册 middleware 为例：

```typescript
// src/middleware/index.ts
export default function(daruk) {
  daruk.registerMiddleware({
    // name 注册内容的 name，对应 daurk 自动 load 时的文件名或者文件夹名
    name: "koa-test-mid",
    // export 导出的内容，对应 daurk 自动 load 时，模块导出的内容
    export: async function(ctx, next) {
      await next();
    }
  });
}
```

需要注意的是，手动注册模块时，只能在约定目录对应的 index.ts 中执行，比如上面注册 middleware 的操作必须在 `src/middlewares/index.ts` 执行，同样的注册其他模块的位置：

- src/middlewares/index.ts
- src/services/index.ts
- src/glues/index.ts
- src/utils/index.ts
- src/timers/index.ts

注意：由于 controller 的目录结构涉及到路由 path 的定义，因此暂不支持通过编程式接口定义。

具体 api：

#### _#registerMiddleware(describe | Array\<describe\>)_

##### Desc: 注册中间件

##### Parameters:

> describe：{
>
> ​ name: **string** 中间件名称
>
> ​ export: **Function** 中间件函数
>
> }

#### _#registerService(describe | Array\<describe\>)_

##### Desc: 注册 service

##### Parameters:

> describe：{
>
> ​ name: **string** service 名称
>
> ​ export: **BaseService** Daruk.BaseService 的子类
>
> }

#### _#registerUtil(describe | Array\<describe\>)_

##### Desc: 注册 util

##### Parameters:

> describe：{
>
> ​ name: **string** util 名称
>
> ​ export: **any** util 的内容
>
> }

#### _#registerTimer(describe | Array\<describe\>)_

##### Desc: 注册 Timer

##### Parameters:

> describe：{
>
> ​ name: **string** 定时器名字
>
> ​ export: **TimerConfig** 定时器配置
>
> TimerConfig:
> ​ {
>
> ​ cronTime: **string**, // crontab 风格的配置
>
> ​ onTick: **function** 定时器触发的回调
>
> ​ onComplete: **function** 定时器完成的回调
>
> ​ }
>
> }

## logger

##### Desc: 日志输出

##### Example:

```javascript
// daruk.logger 只是对 daruk-logger 实例的引用
// daruk-logger 文档：https://github.com/daruk-framework/daruk-logger
daruk.logger.warn("warn message"); // 警告日志
daruk.logger.error({ message: "error message" }); // 错误日志，Object 会被 stringify
daruk.logger.info(); // 普通日志
daruk.logger.debug(); // debug日志
```

// 日志输格式

```json
{
  "level": "warn",
  "logType": "myapp",
  "fileinfo": "/src/index.ts:283:25",
  "msg": "message",
  "os_hostname": "hahahh.local",
  "timestamp": 1538020260774
}
```

## exitHook

##### Desc: 进程退出的回调

##### Example:

```javascript
// daruk.exitHook 只是对 daruk-exit-hook 实例的引用
// daruk-exit-hook 文档：https://github.com/daruk-framework/daruk-exit-hook
daruk.exitHook.addHook((err, cb) => {
  if (err) {
    daruk.logger.error(err.message);
  }
  daruk.logger.info("process exiting");
  // 支持异步任务
  setTimeout(() => {
    daruk.logger.info("process exited");
    cb();
  }, 1000);
});
```
