# 目录约束规范

由于 Daruk 的 auto loader 特性，我们对目录是有一定的使用要求的，如果一个项目是可持续维护的，那么这个项目原则上一定是需要一定的目录约束和规范的。下面详细介绍一下，auto loader 的目录要求和如何修改约束配置。

## 默认目录介绍和配置

| 功能           | 配置项名        | 默认值                 | 必选 | 描述                                                                                                                                 |
| -------------- | --------------- | ---------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 根目录         | rootPath        | undefined              | √    | 定义启动目录，一般都传\_\_dirname                                                                                                    |
| 控制器目录     | controllerPath  | 'controllers'          | ✕    | 可以自定义控制器的 router 目录                                                                                                       |
| 服务模块目录   | servicePath     | 'services'             | ✕    | 可以自定义的 service 目录,比如一个 proxy api 代理模块，比如查询 DB 的模块，比如 MVC 中的 model 和 data 层都可以在 service 目录中编写 |
| 万能目录       | gluePath        | 'glues'                | ✕    | 万能目录，和 service，controller 目录不同的是，他不能访问 ctx，更适合编写可单元测试的独立复用模块                                        |
| 中间件目录     | middlewares     | 'middlewares'          | ✕    | 中间件目录，会按照[daruk.config.ts](./DarukConfig.md)中的 middlewareOrder 来进行顺序加载                                             |
| 工具集目录     | utilPath        | 'utils'                | ✕    | 工具集目录，不能访问 ctx，适合编写独立可复用的工具函数,工具类                                                                        |
| 定时器目录     | timerPath       | 'timers'               | ✕    | 可以放置一些定时器任务，Daruk 提供了一个类 crontab 的辅助方法帮助你来控制你的定时任务                                                |
| 配置项目录     | configPath      | 'config'               | ✕    | 放置项目中的一些通用配置项，方便管理获取                                                                                             |
| daruk 配置文件 | darukConfigPath | 'daruk.config'(文件名) | ✕    | 专门给 daruk 的设置的配置文件地址                                                                                                    |

上面表格简单的列举了这些约定的默认配置值和功能，具体使用方法可以参见之后的具体教程。
