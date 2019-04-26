# middlewares

daruk 会以 middlewares 目录下的第一级文件夹名字或者文件名作为 middleware 的名字（middleware 的名字用于在 middlewareOrder 中定义中间件执行顺序）。比如通过下面的目录结构，会得到 middleware1、middleware2 两个中间件。注意，文件夹里，需要存在 index.ts 文件。

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
import { Daruk, Context } from "daruk";

export default function(daruk: Daruk) {
  return async function(ctx: Context, next: Function) {
    // do something
    return next();
  };
}
```

## 中间件的使用

在注册中间件后，我们需要用 `middlewareOrder` 声明中间件的调用顺序  
中间件注册后不一定会被使用，只有在 `middlewareOrder` 中声明的中间件才会被调用

```typescript
// src/daruk.config.ts
module.exports = function() {
  const globalConfig: any = {};

  globalConfig.middlewareOrder = ["middleware1", "middleware2"];

  return globalConfig;
};
```
