# glues

不管 middleware、controller 或者是 service，都是与用户的访问链路相关的，但我们希望做一些与链路无关的操作，比如连接数据库、进程退出报警等操作。这些操作可以选择放到 glues 目录。

glues 目录的扫描规则和 middlewares、services 目录相同，以第一级目录的文件名或者目录名作为 key，将 glues 导出的内容挂载到 daruk.glue 和 ctx.glue 上。比如下面的目录结构会得到 `daruk.glue.mysql`、`ctx.glue.mysql`

```bash
── glues
|	├── mysql
│   ├── index.ts
│   ├── connect.ts
```

glues 目录下的文件或者文件夹中的 index.ts 需要导出一个函数，函数的返回值就是 glues 的内容，函数的参数是 daruk 实例：

```ts
// src/glues/mysql/index.ts
import { Daruk } from "daruk";
import mysql from "./connect";

export default function(daruk: Daruk) {
  return mysql;
}
```
