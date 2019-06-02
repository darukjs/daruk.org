# utils

utils 目录用于定义一些工具方法，daurk 会挂载 utils 到 daurk.util 和 ctx.util。daurk 不限制 utils 的目录结构，只需要在 index.ts 导出 utils 的内容就行了。

```ts
// src/utils/index.ts
import { Daruk } from "daruk";

export default function(daruk: Daruk) {
  return utils;
}
```
# 例子一
目录/src/utils下创建文件夹“encrypty”，用于存储“加密”的代码。
如图所示：

![Image text](https://raw.githubusercontent.com/vincentCheng/images/master/1.png)

在/src/utils/index.ts中使用encryptedResponse()如下代码所示：

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

- 路径/utils下添加新的文件夹，不需要像services那样，在typings下再做出声明。

- daruk目前不会自动检测/utils下的目录结构。

	例如：this.ctx.util只会出现如下图所示的代码提示。
	
	不会出现代码提示：“this.ctx.util.encypty”。

![Image text](https://raw.githubusercontent.com/vincentCheng/images/master/2.jpg)