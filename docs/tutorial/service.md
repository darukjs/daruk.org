# services

简单来说，Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层，提供这个抽象有以下几个好处：

- 保持 Controller 中的逻辑更加简洁。
- 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
- 将逻辑和展现分离，更容易编写测试用例。

使用场景：

- 复杂数据的处理，比如要展现的信息需要从数据库获取，还要经过一定的规则计算，才能返回用户显示。或者计算完成后，更新到数据库。
- 第三方服务的调用，比如 处理 ioredis 等。

与 middleware 类似，daruk 也会以 services 目录下的第一级文件夹名字或者文件名作为 service 的名字。比如通过下面的目录结构会得到 service1、service2 两个 service。

```bash
services
├── service1.ts
├── service2
|   ├── index.ts
|   ├── someLogic.ts
```

service `文件`或者`文件夹`中的 index.ts 需要导出 Daruk.BaseService 的子类，在该类中可以通过 this.app 访问 daruk 实例，通过 this.ctx 访问 context：

```ts
// src/services/userInfo.ts
import { BaseService } from "daruk";

export default class UserInfo extends BaseService {
  public getUserList() {
    const { mysql } = this.ctx.glue;
    return mysql.queryUserList();
  }
}
```

## service 的使用

service 会以遍历到的文件夹或文件名作为 key 自动挂载到 ctx.service 上。

注意，只能通过 ctx.service 访问 service，不能通过 daruk.service 访问，因为 service 应该是和请求链路绑定的，只能在请求链路中调用，通常是在 controller 中调用，如果没有请求到达服务器，不应该手动调用 service。

在 controller 中使用 service：

```typescript
// src/controllers/user.ts
import { BaseController, get } from "daruk";

export default class User extends BaseController {
  @get("/")
  public async index() {
    const { userInfo } = this.ctx.service;
    // do something
  }
}
```

另外需要注意，每次用户请求时，被调用的 service 都会实例化，因此不要在 service 类的 constructor 中执行复杂操作。 其实一般不需要定义 constructor，如果定义了，必须像下面这样执行 super：

```typescript
// src/controllers/user.ts
import { BaseController, Context, get } from "daruk";

export default class User extends BaseController {
  public constructor(ctx: Context) {
    super(ctx);
  }
}
```

## service 的添加

- 创建脚本 src/services/TestService.ts
- 在脚本 typings/daruk/services.d.ts 中注册 TestService。如下所示：

```typescript
import "daruk";
...;
import TestService from "../../src/services/TestService";

declare module "daruk" {
  interface Service {
    ...;
    TestService: TestService;
  }
}
```
