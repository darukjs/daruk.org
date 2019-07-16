# 安装

## 脚手架安装

daruk 提供了 cli 命令可以自己定义项目模板，默认提供了 2 种，详情参考[脚手架](./Scaffolding.md).

```bash
$ yarn global add daruk-cli # cnpm install -g daruk-cli
$ daruk init daruk-example
$ cd daruk-example
$ npm run dev
```

注意：windows 下有时候会启动失败，请删除"node_modules"，再运行“cnpm install”或“npm install ”重新安装。

## 独立模块安装

可直接使用 yarn，npm，cnpm 在支持[ts 的环境中安装](./typescript.md),但是需要额外配置和定义一些目录规范，详情参考[目录文件规范](./specification.md).

```bash
$ yarn add daruk
$ npm install daruk --save
$ cnpm install daruk --save
```

在项目中直接使用 Daruk 实例运行 web app 即可

```ts
// src/index.ts
import { Daruk } from "daruk";
let app = new Daruk("myapp", { rootPath: __dirname, debug: true });
app.listen(3000);
```

```ts
// src/controllers/index.ts
import { BaseController, Context, get } from "daruk";
export default class Index extends BaseController {
  @get("/")
  public async index(ctx: Context, next: Function) {
    ctx.body = "Hello world";
  }
}
```
