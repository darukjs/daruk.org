# 装饰器

#### http method 装饰器

- @get
- @post
- @del，由于 delete 是 js 的关键件，因此用 del 指代 delete
- @put
- @patch
- @options
- @head
- @all

#### 框架装饰器

Daruk 会自动将约定目录中的内容挂载到 Daruk 实例或者 context，但在不方便拿到 Daruk 实例后者 context 的地方要怎么获取这些内容呢。这时，框架级的装饰器就派上用场了。支持的框架装饰器有：

- @config，注入项目配置，可以接收一个字符串参数，指定要注入配置中的某个字段的内容
- @util，注入 util，可以接收一个字符串参数，指定要注入的 util 名
- @glue，注入 glue，可以接收一个字符串参数，指定要注入的 glue 名
- @logger，注入 logger，可以接收一个字符串参数，自定义 fileInfo，对应 [KoaLogger.customFileInfo](https://github.com/daruk-framework/daruk-logger#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97fileinfo)

示例：

```typescript
// src/glues/mysql/connect.ts
import { Daruk, config, util, glue, logger } from '@sina/daruk'

export default class MySqlConnector {
  // 注入项目配置中的 mysql 配置
  @config('mysql')
  public mysqlConfig: Daruk['config']['mysqlConfig'];
  // 注入 util
  @util()
  public util: Daruk['util'];
  // 注入 glue 中的 validator 模块
  @glue('validator')
  public validator: Daruk['glue']['validator'];
  // 注入 logger，并自定义 logger 的 fileInfo
  @logger('MySqlConnector')
  public logger: Daruk['logger'];
}
```

#### 中间件装饰器

有时候我们希望对单个路由应用一个中间件，这时可以使用中间件装饰器：

- @middleware，接收一个字符串参数，指定要应用的中间件的名字，名字由 middlewares 目录或 daruk.config.ts 中定义的 middleware 确定

示例：

```typescript
// src/controllers/user.ts
import { BaseController, post } from '@sina/daruk'

export default class User extends BaseController {
  @middleware('login-validator')
  @post('/login')
  public index () {

  }
}
```