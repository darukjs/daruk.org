# 装饰器

## http method 装饰器

Daruk 通过装饰器定义 http method，也可以通过装饰器参数进一步定义路由的 path。所有的 http method 装饰器如下：

- @get
- @post
- @del，由于 delete 是 js 的关键字，因此用 del 代替 delete
- @put
- @patch
- @options
- @head
- @all
- @JSON

示例：

```typescript
import { BaseController, get, post, del, put, JSON } from "daruk";

export default class ContactList extends BaseController {
  @JSON()
  @get("/")
  public async getHandle() {
    return { foo: 1 };
  }
  @post("/somePath")
  public async postHandle() {}
  @del("/somePath")
  public async delHandle() {}
  @put("/")
  public async putHandle() {}
}
```

## 框架装饰器

Daruk 会自动将约定目录中的内容挂载到 Daruk 实例或者 context，但在不方便拿到 Daruk 实例或者 context 的地方要怎么获取这些内容呢。这时，框架级的装饰器就派上用场了。支持的框架装饰器有：

- @config，注入项目配置，可以接收一个字符串参数，指定要注入配置中的某个字段的内容
- @util，注入 util，可以接收一个字符串参数，指定要注入的 util 名
- @glue，注入 glue，可以接收一个字符串参数，指定要注入的 glue 名
- @logger，注入 logger，可以接收一个字符串参数，自定义 fileInfo，对应 [KoaLogger.customFileInfo](https://github.com/darukjs/daruk-logger#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97fileinfo)

示例：

```typescript
// src/glues/mysql/connect.ts
import { Daruk, config, util, glue, logger } from "daruk";

export default class MySqlConnector {
  // 注入项目配置中的 mysql 配置
  @config("mysql")
  public mysqlConfig: Daruk["config"]["mysqlConfig"];
  // 注入 util
  @util()
  public util: Daruk["util"];
  // 注入 glue 中的 validator 模块
  @glue("validator")
  public validator: Daruk["glue"]["validator"];
  // 注入 logger，并自定义 logger 的 fileInfo
  @logger("MySqlConnector")
  public logger: Daruk["logger"];
}
```

## 中间件装饰器

有时候我们希望对单个路由应用一个中间件，这时可以使用中间件装饰器：

- @middleware，接收一个字符串参数，指定要应用的中间件的名字，名字由 middlewares 目录或 daruk.config.ts 中定义的 middleware 确定

示例一：

- 创建脚本 “ src/middlewares/testMid.ts”，代码如下：

```typescript
import { Context, Daruk } from "daruk";

export default (daruk: Daruk) => {
  return async (ctx: Context, next: Function) => {
    console.log("测试 testMid.ts");
    return next();
  };
};
```

- 创建脚本 “src/controllers/myMid.ts”，代码如下：

```typescript
import { BaseController, post } from "daruk";

export default class User extends BaseController {
  @middleware("testMid")
  @get("/testmid")
  public index() {
    console.log("测试 myMid.ts");
  }
}
```

运行命令：

```bash
npm run dev
```

当你进入网址："你的网址"/myMid/testmid 的时候，控制台输出

```bash
测试 testMid.ts
测试 myMid.ts
```

- 注意：
- “myMid”中是平常的路由中间件，用于“运行特定路由”时执行。
- 如果是“登录验证”，一般所有的路由都需要验证。具体方法请参考“示例二”。

示例二：

- 创建脚本 “ src/middlewares/login-validator.ts”，代码如下：

```typescript
import { Context, Daruk } from "daruk";

export default (daruk: Daruk) => {
  return async (ctx: Context, next: Function) => {
    console.log("测试 login-validator.ts");
    return next();
  };
};
```

- 创建脚本 “src/controllers/user.ts”，代码如下：

```typescript
import { BaseController, post } from "daruk";

export default class User extends BaseController {
  @post("/login")
  public index() {
    console.log("测试 login.ts");
  }
}
```

在 daruk.config.ts 中添加中间件“login-validator”

```typescript
darukConfig.middlewareOrder = [
    ...,
    'login-validator'
  ];
```

运行命令：

```bash
npm run dev
```

当你进入网址："你的网址"/user/login 的时候，控制台输出

```bash
测试 login-validator.ts
测试 login.ts
```

达到的效果为：

- 进入所有的路由之前，都需要通过“登录验证”。

如果在 @post("/login") 上面再添加 @middleware("testMid") ，例如：

```typescript
import { BaseController, post } from "daruk";

export default class User extends BaseController {
  @middleware("login-validator")
  @post("/login")
  public index() {
    console.log("测试 login.ts");
  }
}
```

运行后则会打印出这样的结果：

```bash
测试 login-validator.ts
测试 login-validator.ts
测试 login.ts
```

显然这有些不符合程序设计预期。
