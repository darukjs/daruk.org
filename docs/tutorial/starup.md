# 项目启动

## 初始化服务方法

在安装环节，我们介绍了一个简单的 web 服务是如何初始化和运行的。我们下边来详细介绍一下，如何启动一个 web 服务，Daruk 都提供了哪些方法，他们在 Daruk 内部都做了对应的什么事情。

本章并不介绍具体的方法参数，详细的方法介绍和参数说明，请查阅相关的实例 API 手册。

## DarukServer 实例

首先 DarukServer 方法返回的是一个 DarukApp 实例，启动这个服务实例之前，我们可以通过 DarukApp 实例来做一些配置和初始化的操作，也就是我们这一章讲的，项目启动相关功能。

```typescript
import { DarukServer } from "daruk"; // 引入 DarukServer

(async () => {
  // 因为部分实例方法是异步的，所以我们一般都在启动服务器时，用 async 匿名函数来配合 await 简化我们的代码。
  let DarukApp = DarukServer();
})();
```

我们通过拿到 Daruk 实例后，我们的实例方法主要有：`initOptions`,`loadFile`,`initPlugin`,`listen` 这 4 个启动方法，下边我们就简单介绍一下他们的各个功能和作用。

## 初始化参数

### initOptions

`initOptions` 方法的作用是用来初始化实例参数的，比如我们可以指定我们的 `rootPath` 项目根目录是哪个目录，还有可以指定我们加载的`middlewareOrder`中间件顺序，比如：

```typescript
DarukApp.initOptions({
  rootPath: __dirname,
  middlewareOrder: ["koa-ejs", "koa-favicon"],
});
```

上面的代码我们就成功的配置了我们的根目录为当前文件的工作目录，并且指定加载了两个服务中间件，他们的执行顺序就是数组定义顺序。先执行 `koa-ejs` 再执行 `koa-favicon`。

## 加载项目源文件

### loadFile

这里大家就有疑问了，我们的`koa-ejs`和`koa-favicon`中间件定义在哪了呢？这就需要我们了解第二个实例方法，`loadFile` 方法就是用来加载我们的项目`源文件`的。我们这里说的`源文件`其实就是帮我们自动执行了对应的 ts 脚本，而不需要我们逐个的手工引入执行了。

这里就需要大家注意，Daruk 框架并没有限制大家的项目目录格式，这就说明，你可以定义任何的目录格式来进行搭建项目，也可以直接把所有的`源文件`代码写到一个文件中，那么就不需要 `loadfile` 方法来进行加载了。这里的 `loadfile` 方法就是帮助我们自己定义工作目录用的辅助函数。

我们下边举个例子：

```typescript
await DarukApp.loadFile("./middlewares");
await DarukApp.loadFile("./controllers");
await DarukApp.loadFile("./services");
```

我们加载了我们根目录下边的 3 个目录文件，Daruk 会帮助你遍历递归执行这些目录中的 ts 和 js 文件，他们没有前后顺序一说，因为我们的`源文件`中定义的应该都是不可执行的类文件，这些文件会因为你选择的不同功能的装饰器，一起 bind 到 Daruk 的 IoC 容器中，并不会实际执行，当然除非你在这些目录的文件里写了一些自执行代码，那么它们可能将会立即执行。

## 初始化源文件和插件

### initPlugin

我们使用 `loadFile` 方法来加载完毕我们的类文件后，我们需要调用 `initPlugin` 方法来进行挂载，这个方法不但会挂载外部文件，也会挂载 Daruk 内部的内置插件和功能，所以`initPlugin`方法必须被主动调用一次。不可以和 `initOptions`或者和实例化的构造器中自执行，因为我们的源文件中可能会有一些异步插件或者方法，需要等他们全部执行完毕才可以进行真正的 `initPlugin`，我们下面举一个特殊的例子。

```typescript
let dbConfig = await request("http://config/db.config");

let DbInstance = new ConnectDB(dbConfig);

@provide("Db")
class Db {
  public async getConnection() {
    return DbInstance;
  }
}

await DarukApp.initPlugin();
```

我们首先假设我们的服务初始化需要依赖一些不确定的外部因素，比如一份远程的配置，有可能是 http 的 api，也可能是一份 etcd 的配置等等。然后我们拉取到这个配置后，才能完成我们的某些功能的初始化，比如我上面举例的这个 Db 类，返回的是我们连接 DB 的实例，而这个实例又因为需要异步依赖，那么我们就可以在初始化之前，也就是`initPlugin`之前，做一些异步拉取的功能了。

这样我们就可以保证我们的服务在启动后，DB 初始化之前的那个间隔里有一些问题了，比如配置拉取失败，或者拉取和注册之前，就有人需要调用 Db 类，从而导致异常。

## 如何启动 Http/Https 服务

### listen

最后完成所有的项目启动准备后，就可以调用 `listen` 方法了，DarukApp 实例的 `listen` 方法和 `koa2`的 `listen` 方法 API 一致，当你想要自己实现一个 https 服务的时候，可能需要注意 `listen` 的调用就不再需要了。

启动 Http 服务:

```typescript
await DarukApp.listen(8080);
```

启动 Https 服务:

```typescript
import fs from "fs";
import https from "https";
import path from "path";

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "./certificate/private.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "./certificate/ca.cer")),
};
DarukApp.app.httpServer = https
  .createServer(options, DarukApp.app.callback())
  .listen(443);
DarukApp.emit("serverReady");
```

上面的例子我们展示了，如何启动一个 https 服务，写法和启动一个 koa2 的 https 服务是一样的，这里可以参考 Daruk 的 listen 部分实现，如果订阅了 Daruk 的生命周期，那么需要手工触发一下 serverReady 事件，因为这个事件本来是在 DarukApp 实例上的 listen 中被调用的。
