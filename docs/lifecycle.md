# 生命周期

#### 加载约定目录相关事件

 执行 `new Daruk()` 后，daruk 会同步地去加载约定目录的，所以要监听加载过程中的事件，一定要在实例化 Daruk 之前：

 ```ts
import { Daruk, DarukEvents } from '@sina/daruk'

DarukEvents.on('configLoaded', (daruk:Daruk) => {
  console.log(daruk.config)
})

new Daruk('myapp')
```

支持的事件有（按触发顺序列出）：

- `configLoaded` 
- `darukConfigLoaded`  
- `utilLoaded`  
- `glueLoaded`  
- `serviceLoaded`  
- `middlewareLoaded`  
- `controllerLoaded`  
- `timerLoaded` 


#### access 事件

当完用户请求我们的服务，我们的服务响应用户后，会触发 `access` 事件：

```ts
import { DarukEvents, Context } from '@sina/daruk'

DarukEvents.on('access', (ctx:Context) => {
  // ctx 中会附带本次请求相关日志和中间件执行耗时信息
  console.log(ctx.access_log)
  console.log(ctx.middleware_perf)
})
```

#### exit 事件

当进程出错退出或重启时会触发 exit 事件，允许你在进程退出时做某些操作：

```ts
import { DarukEvents } from '@sina/daruk'

// 如果是报错导致的退出，会存在 error 参数
DarukEvents.on('exit', (err:Error, daruk:Daruk) => {
  console.log(err)
})
```
注意 exit 事件的回调中只能执行同步操作，如果想做异步操作，请参考 [Daruk.exitHook](./api.html#exithook)

