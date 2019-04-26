# 脚手架

## 安装脚手架

```bash
$ yarn add global daruk-cli
```

## 脚手架 API

目前我们的脚手架只支持 2 个 Template：

- Daruk 的 Demo 模板
- 一个和 Daruk 无关的 TS 环境模板

我们可以通过下面的命令来进行默认模板的安装(默认模板是 Daruk Demo)：

```bash
$ daruk init <repository name>
```

我们也可以使用 `--ignore` 来忽略本地模板缓存，我们可能偶尔会进行模板升级。

```bash
$ daruk init --ignore <repository name>
```

当然你也可以传入自定义的模板地址来进行脚手架的使用：

```bash
# 使用自定义的模板
# 模板 url 地址需要满足规则: https://www.npmjs.com/package/download-git-repo
# 比如这里我们使用模板工程中的 nodejs-ts-scaffold 分支作为模板初始化项目
daruk init custom-daruk-app 'daruk-framework/daruk-template.git#nodejs-ts-scaffold'
```

上面的代码我们就在本地安装了我们另外一个纯的支持 NODEJS 和 TS 的脚手架模板。

你也可以传入你自己配置和开发的模板地址，只使用我们的脚手架工具即可，模板源码可以[参考这里](https://github.com/daruk-framework/daruk-template)。
