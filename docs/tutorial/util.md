# utils

utils 目录用于定义一些工具方法，daruk 会挂载 utils 到 daruk.util 和 ctx.util。daruk 不限制 utils 的目录结构，只需要在 index.ts 导出 utils 的内容就行了。

```ts
// src/utils/index.ts
import { Daruk } from "daruk";

export default function(daruk: Daruk) {
  return utils;
}
```

# 例子一

目录/src/utils 下创建文件夹“encrypty”，用于存储“加密”的代码。
如图所示：

```ts
export function encryptedResponse(content: JSON | Object) {
  return content;
}
```

在/src/utils/index.ts 中使用 encryptedResponse()如下代码所示：

```ts
import daruk from "../app";
import { encryptedResponse } from "./encrypty/index";

function sort(arr: Array<string | number>) {
  return arr.sort();
}

export default () => {
  return {
    sort,
    encryptedResponse
  };
};
```

注意：

- 路径/utils 下添加新的文件夹，不需要像 services 那样，在 typings 下再做出声明。

- daruk 目前不会自动检测/utils 下的目录结构。不会出现代码提示：“this.ctx.util.encypty”。
