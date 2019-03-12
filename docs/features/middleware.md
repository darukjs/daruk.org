# Daruk Middleware

Daruk 模板工程集成了很多 KOA 中的优秀开源中间件，同时也开发了基于性能的监控，及链路查询等中间件，以便于用户更好的审查搭建的Nodejs项目，下面介绍一下 Daruk 中内置的 Middleware。


#### #monitor

> 注意monitor必须在所有中间件之后使用，也就是写在globalConfig.middlewareOrder的最后
内置的监控中间件，包含监控当前Nodejs的单核CPU使用率，内存占用率以及针对Nodejs进程的内存分析，方便定位泄漏点，以及整机的CPU使用率等信息。

所有的性能方法可以通过路由获取，如果项目中需要使用获取性能API，可`require('daruk/libs/monitor')`



***monitor.computePerf(period: number)* ：统计当前机器所有的cpu的性能情况以及内存的用量 **

`GET /monitor/profiler` 

​	参数 period： 可以指定需要多少秒内的机器cpu性能 默认 2000ms

结果：

```Json
{
    "cpu": {
        "device": {
            "userPercent": "0.18",
            "sysPercent": "0.11",
            "idlePercent": "0.70"
        },
        "process": {
            "elapTimeMS": 2003.953394,
            "elapUsageMS": 0.882,
            "cpuPercent": "0.0",
            "period": 2000
        }
    },
    "memory": {
        "rss": "43.16",
        "heapTotal": "51.62",
        "heapUsed": "45.38",
        "external": "0.08"
    }
}
```



***monitor.functionProfiler(period: number)* : 统计某个时间段内的function执行耗时**

`GET /monitor/profiler/function ` 

​	参数 period： 可以指定需要多少秒内的方法执行耗时 默认 2000ms	

结果(仅截取部分): 格式为 执行时间 - 方法名 - 位置- 行号

```json
(root)(101.1ms 100%)
[33m├── [0m[33m_tickCallback[0m (1.2ms 1.22%)(internal/process/next_tick.js 41)
[33m│   [0m[33m└── [0m[33mrunMicrotasks[0m (1.2ms 100.00%)
[33m│   [0m    [33m└── [0m[33mbodyParser[0m (1.2ms 100.00%)(/Daruk/node_modules/koa-bodyparser/index.js 72)
[33m│   [0m        [33m└── [0m[33mdispatch[0m (1.2ms 100.00%)(/Daruk/node_modules/koa/node_modules/koa-compose/index.js 35)
[33m│   [0m            [33m└── [0m[33manonymous[0m (1.2ms 100.00%)(/Daruk/src/index.ts 217)
[33m│   [0m                
```



***monitor.memSnapshot()*: 获取内存快照， 将下载当前具体的内存快照，可通过chrome 的Profiler进行分析**

`GET /monitor/profiler/mem `

当然， 如果你不想下载下来手动分析，你也可以通过调用以下路由获取详情:



***monitor.memSnapshotAnalytics()*: 分析内存**

`GET /monitor/profiler/mem-analytics`

结果:

```Json	
{
    "heapMap": {},
    "leakPoint": [
        {
            "index": 27992,
            "size": 14347168,
            "id": "@55985"
        },
        {
            "index": 27993,
            "size": 13291464,
            "id": "@55987"
        }
    ],
    "statistics": {
        "total": 49699126,
        "v8heap": 49609744,
        "native": 89382,
        "code": 2803392,
        "jsArrays": 1017696,
        "strings": 27068032,
        "system": 2052496
    },
    "rootIndex": 0,
    "aggregates": {
        "(system)": {
            "count": 106018,
            "distance": -5,
            "self": 5318360,
            "maxRet": 8091728,
            "type": "hidden",
            "name": null,
            "idxs": []
        }
        // ...省略等
}
```



#### #@sina/koa-logger

针对每次请求都会自动输出日志   
日志输出格式  
```javascript
{"level":"access","logType":"myapp","fileinfo":"/src/index.ts:283:25","remote_addr":"::1","method":"GET","url":"/monitor/profiler?period=1000","http_version":"HTTP/1.1","status":200,"referrer":"","request_time":1538020259732,"perf":1016,"user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.9 Safari/537.36","requestId":"923126fb-3f5c-43d5-8b53-f587d92b8b61","msg":"{utils2ctx:0.294646,service2ctx:0.163679,@sina/koa-logger:0.748516,koa-handle-error:0.123145,koa-x-request-id:2.102746,asyncStore:0.465898,koa-favicon:0.279888,koa-static:5.66784,koa-bodyparser:0.369535,monitor:1006.011888,router:/monitor/profiler?period=1000:0.319268,allowedMethods:0.29296,sum:1016.840009}","os_hostname":"hahahh.local","timestamp":1538020260774}
```

#### #asyncStore
Todo

#### #service2ctx
使用这个中间件后，你可以在ctx上直接使用services
```javascript
ctx.services.someFunc()
```
#### #utils2ctx
使用这个中间件后，你可以在ctx上直接使用utils
```javascript
ctx.utils.someFunc()
```
#### 第三方中间件

#### #koa-handle-error

用于输出koa中间件产生的错误

[koa-handle-error简介](https://github.com/axross/koa-handle-error)



#### #koa-x-request-id

用于记录每次请求的唯一请求id

[koa-x-request-id简介](https://github.com/segmentio/koa-request-id)



#### #koa-favicon

用于favicon服务的Koa中间件。

[koa-favicon简介](https://github.com/koajs/favicon)



#### #koa-bodyparser

body parser

[koa-bodyparser简介](https://github.com/koajs/body-parser)



#### #formidable-upload-koa

用于上传文件

[formidable-upload-koa简介](https://github.com/PaulRosset/formidable-upload-koa)



#### #koa-json-body

parse JSON request bodies

[koa-json-body简介](https://github.com/venables/koa-json-body)



#### #koa-json

JSON pretty-printed response middleware.

[koa-json简介](https://github.com/koajs/json)



#### #koa2-cors

配置 **Access-Control-Allow-Origin** CORS 头

[koa2-cors简介](https://github.com/zadzbw/koa2-cors)



#### #koa-proxies

koa中间件中的http代理

[koa-proxies简介](https://github.com/vagusX/koa-proxies)



#### #koa-ip

用于设置ip过滤和白名单

[koa-ip简介](https://github.com/nswbmw/koa-ip)



#### #koa-static

Koa 静态资源服务

[koa-static简介](https://github.com/koajs/static)



#### #koa-jsonp

jsonp请求

[koa-jsonp简介](https://github.com/kilianc/koa-jsonp)



#### #koa-compress

压缩功能

[koa-compress简介](https://github.com/koajs/compress)



#### #koa-session

koa会话功能

[koa-session简介](https://github.com/koajs/session)



#### #koa-flash-simple

koa闪存能力

[koa-flash-simple简介](https://github.com/ifraixedes/node-koa-flash-simple)



#### #koa-ejs

koa模板渲染引擎

[koa-ejs简介](https://github.com/koajs/ejs)



#### #koa-body-clean

用于自动清理文件的Koa中间件

[koa-body-clean简介](https://github.com/rferro/koa-body-clean)



#### #http-server-shutdown

http优雅关机，当关机时请求还未响应，将会在执行完请求后再关闭服务器

[http-server-shutdown简介](https://github.com/dxil/http-server-shutdown)