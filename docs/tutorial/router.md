# controllers

很多情况下，路由的存在是为了将请求映射到 controller 层处理，因此我们采用了 controller 定义即路由定义的约定。daruk 会递归读取 controllers 目录下的文件，以文件名作为路由 path，特别的，`index.ts` 代表的 path 是 `/`，然后再配合装饰器来定义路由的 http method。所有的 controller 文件都需要导出 Daruk.BaseController 的子类，在该类中可以通过 this.app 访问 daruk 实例，通过 this.ctx 访问 context。

比如我们添加一个 `GET /contact/list` 路由：

```typescript
// src/controllers/contact/list.ts
import { BaseController, get, Context } from "daruk";

export default class ContactList extends BaseController {
  @get("/")
  public async getContactList(ctx: Context, next: Function) {
    ctx.body = "contact list";
    return next();
  }
}
```

所有的 http method 都有对应的装饰器，比如 `@get`、`@post`、`@put`、`@options` 等。

路由装饰器可以接受一个字符串参数，用于进一步指定路由的 path，比如要实现上面的 `GET /contact/list` 路由，我们可以这样写：

```typescript
// 注意，删除了 src/controllers/contact 目录，直接在 contact.ts 中定义路由
// scr/controllers/contact.ts
import { BaseController, get, Context } from "daruk";

export default class Contact extends BaseController {
  @get("/list")
  public async getContactList(ctx: Context, next: Function) {
    ctx.body = "contact list";
    return next();
  }
}
```

另外需要注意，每次用户请求时，对应的 controller 都会实例化，因此不要在 controller 类的 constructor 中执行复杂操作。 其实一般不需要定义 constructor，如果定义了，必须像下面这样执行 super：

```typescript
// scr/controllers/contact.ts
import { BaseController, get, Context } from "daruk";

export default class Contact extends BaseController {
  public constructor(ctx: Context) {
    super(ctx);
  }
}
```
