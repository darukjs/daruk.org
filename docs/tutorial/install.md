# 安装

## 安装 NodeJs 环境

可通过 NodeJs 官网进行适合自己环境的安装 [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## 安装 Daruk 框架和 Typescript 开发环境

```bash
mkdir daruk-demo # 创建项目目录
cd daruk-demo # 进入项目目录
npm init # 使用 npm 初始化项目信息
npm add daruk ts-node typescript # 安装 Daruk 框架和 typescript
mkidr src # 创建源码目录
touch src/index.ts # 创建入口文件
touch tsconfig.json # 创建 typescript 的项目配置文件
```

## 编写 web 应用 `src/index.ts`

```typescript
import { DarukServer, controller, injectable, get } from "daruk";

(async () => {
  const myapp = DarukServer();

  @injectable()
  @controller()
  class Index {
    @get("/")
    public async index(ctx: any) {
      ctx.body = "hello world";
    }
  }

  myapp.initOptions();
  await myapp.initPlugin();
  myapp.listen(3000);
})();
```

## 编写 tsconfig.json 文件

```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./build",
    "rootDir": "./src",
    "typeRoots": [],
    "types": [],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts"]
}
```

## 编辑 `package.json` 的启动和编译脚本

```json
{
  "scripts": {
    "dev": "ts-node --project tsconfig.json --files src/index.ts",
    "build": "tsc"
  }
}
```

## 启动 Daruk 服务

```bash
npm run dev
```

## 在线例子

可以查看这里完整的项目事例：[https://github.com/darukjs/daruk-demo](https://github.com/darukjs/daruk-demo)
