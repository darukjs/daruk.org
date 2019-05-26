# utils

utils 目录用于定义一些工具方法，daruk 会挂载 utils 到 daruk.util 和 ctx.util。daruk 不限制 utils 的目录结构，只需要在 index.ts 导出 utils 的内容就行了。

```ts
// src/utils/index.ts
import { Daruk } from "daruk";

export default function(daruk: Daruk) {
  return utils;
}
```
