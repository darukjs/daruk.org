# 装饰器

## inversifyJS 的装饰器

Daruk 的 IoC 实现是利用的 [inversifyJS](http://febeacon.com/inversifyjs_docs_cn/) 框架，它本身就是基于 TypeScript 的，提供给 JavaScript 和 Node.js 控制反转(IoC)库。IoC 容器使用类构造函数来标识并注入其依赖项。InversifyJS 的 API 非常易用，给与开发者最好的 OOP 和 IoC 实践。

前文我们讲了 `loadFile` API，他加载的这些 `源文件` 就是利用的 IoC 来管理的类构造函数。所以 Daruk 对外暴露的装饰器有一部分就是直接使用了 inversifyJS 的装饰器。

有人可能会有疑惑，我不会使用或者没有 inversifyJS 的基础和知识，是否会影响我使用 Daruk 呢？ 答案当然是不影响，但是有些时候有些高级场景可能还是会用到，但是并不会给开发者造成太多的困扰。我们假设您是一名 IoC 零基础开发者，我们下边给大家逐个介绍一下这些重要的装饰器 API，以保证您正确的使用 Daruk 来体验这种编程方式。

## injectable 装饰器

InversifyJS 允许您的类直接依赖其他类。当您想要这样做时，请使用@injectable 装饰器。所以我们定义一个`源文件`中的类的时候，基本上都会带着 `@injectable` 装饰器，代表这个类允许被注入和被别人引用。

```typescript
@injectable()
class MyClassA {
  public throw() {}
}
@injectable()
class MyClassB {
  public say() {}
}
```

我们定义好了两个类，他们都是可以被别人直接依赖的，这 2 个类定义了各自的方法，在 inversifyJs 中还有容器的概念，Daruk 对外提供了这个容器，叫做 `darukContainer` 默认都是在这一个容器里管理所有的类。所以只使用 `@injectable` 是无法和 Daruk 的 IoC 容器产生关联的，当然你可以使用 bind 方法自己做关联，但是建议一般用户不要这样做，除非你要开发定制的插件。

正确的做法是利用 Daruk 的内置类装饰器配合 `@injectable` 装饰器，帮你建立绑定关系，其实 Daruk 就是这么干的，可以参考后边的内置类装饰器说明。

## inject 装饰器

我们在上面定义了 2 个 Class 后，我们可能需要一个类把他们两个串联起来，我们可以利用 `@inject` 来进行关联注入。

```typescript
@injectable()
class Main {
  @inject public MyClassA;
  @inject public MyClassB;
  public run() {
    this.MyClassA.throw();
    this.mYClassB.say();
  }
}
```

我们利用 `@inject` 在 Main 上注入了 2 个类的实例，这里请注意，是实例，不需要我们自己去 new 了，InversifyJS 帮你完成了初始化工作，我们这里可以这么简单的理解。

接下来就是绑定环节，但是我们这里不对绑定做深入的介绍，因为使用 Daruk 的时候，只用 `@injectable` 是无法让类正常工作的，必须配合 Daruk 内置装饰器，然后委托给 Daruk 来进行启动和调用。

看到这里，聪明的你一定就理解了 InversifyJS 这个的作用，主要就是帮助我们对类代码进行委托和管理的，编写好的功能最终由框架决定什么时候进行初始化和执行，这也是 Daruk2.0 的设计思路，包括插件，中间件，路由的注册都是通过这个方式进行的。

## provide 装饰器

这里再介绍装饰器 `@provide`。我们有的时候，可能就是需要注册一个和框架无关的类，比如一个 工具集 或者一个 纯逻辑类，他和 web 服务本身没有关系，比如我们的 RPC 方法，单纯的请求数据或者查询数据的类。那么我们就可以使用这个装饰器来定义。下边我们看一段代码了解一下 provide 到底做了什么。

```typescript
@injectable()
class MyClassA {
  public throw() {}
}
darukContainer.bind<MyClassA>(MyClassA).toSelf();
```

我们定义了一个可注入的类，然后绑定到了 Daruk 内置的容器中，然后我们就可以在其他的类中用 `@inject` 来使用了。

如果用`@provide`来写的话就是这样：

```typescript
@provide("MyClassA")
class MyClassA {
  public throw() {}
}
```

我们不需要再写 bind 方法了，就可以直接使用，provide 的作用就是帮助你自动注入容器。 如果你看了 Daruk 的源码，其实是在 `initPlugin` 的过程中，我们做了全部 provide 的 bind 的操作。

## fluentProvide 装饰器

fluentProvide 看名字就知道，它的功能比 provide 要多，因为框架代理了绑定的操作，所以我们无法控制绑定时的一些能力了，对于这些能力可以参考 [容器 API](http://febeacon.com/inversifyjs_docs_cn/routes/wiki/container_api.html) 比如指定这个类的上下文约束、作用域和其他高级绑定功能。

```typescript
@(fluentProvide("MyClassA")
  .inSingletonScope()
  .whenTargetTagged("A")
  .done())
class MyClassA {
  public throw() {}
}
```

这里我们给 MyClassA 这个类绑定的时候指定了作用域和约束条件,这里可以参考 inversifyjs 的相关 API: [带标签的绑定](http://febeacon.com/inversifyjs_docs_cn/routes/wiki/tagged_bindings.html)
我们一般都不会使用这么复杂的功能，大部分的时候，fluentProvide 还是在定义作用域上，比如某些实例在整个 web 服务周期，只能被实例化一次的情况。比如 数据库 连接等需求。

## middleware 装饰器

`@middleware` 是 Daruk 提供的内置类装饰器，作用是使用。对应他的还有 `@defineMiddleware`，表明这个类是一个中间件，对于中间件类，我们有一定的编写要求：

```typescript
import ejs = require("koa-ejs");
import { join } from "path";
import { Daruk, defineMiddleware, injectable, MiddlewareClass } from "daruk";

@defineMiddleware("koa-ejs")
class KoaEjs implements MiddlewareClass {
  public initMiddleware(daruk: Daruk) {
    ejs(daruk.app, {
      root: join(daruk.options.rootPath, "./view"),
      viewExt: "tpl",
    });
  }
}
```

上面的代码我们定义了一个 Daruk 的中间件，中间件类必须 implements 我们内置的 MiddlewareClass 接口格式，其实就是必须要在 `initMiddleware` 中定义中间件。 他可以有返回值也可以没有返回值，决定于这个中间件是否有需要有返回值。

```typescript
import {
  Daruk,
  DarukContext,
  defineMiddleware,
  injectable,
  MiddlewareClass,
  Next,
} from "daruk";

@defineMiddleware("cors")
class Cors implements MiddlewareClass {
  public initMiddleware(daruk: Daruk) {
    return async (ctx: DarukContext, next: Next) => {
      ctx.set("Access-Control-Allow-Origin", "*");
      ctx.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      await next();
    };
  }
}
```

可以看到，和直接定义 koa2 的中间件很像，区别在于 initMiddleware 中可以获取到 DarukApp 实例，在实例上我们可以访问对应的 options 参数或者实例属性而已。

而用法也很简单，比如我们可以在全局让这个 middleware 生效，只需要在 initOptions 中定义 order 即可，当然也可以非全局生效，利用 `@middleware` 来生效单路由局部中间件。

```typescript
@controller()
class Index {
  @middleware("cors")
  @get("/")
  public async index(ctx: DarukContext, next: Next) {}
}
```

直接用到对应的 controller 类的 对应局部方法上即可。

## controller 装饰器

定义一个 controller 类直接使用 `@controller` 装饰器即可，然后再配合对应的 resetful 装饰器就可以了，参考上面 中间件的部分写法即可。

## priority 装饰器

我们的 controller 类可能有时候，需要控制定义顺序，我们可以利用 priority 装饰器来进行指定。

```typescript
@controller()
@priority(-1)
class PrefixIndexA {
  @get("/index")
  public async test(ctx: DarukContext, next: Next) {
    ctx.body = "A";
    await next();
  }
}

@controller()
class PrefixIndexB {
  @get("/index")
  public async test(ctx: DarukContext, next: Next) {
    ctx.body = ctx.body + "B";
  }
}
```

我们定义了 2 个类，每个类上都有一个 `/index` 的路由，这在 koa 中是被允许的，那么我们如何决定顺序呢，这个时候就可以利用 `@priority` 来控制执行顺序了, `/index` 的返回结果是 AB。

## service 装饰器

在一个 web 服务中我们除了定义 路由，逻辑类之外，我们可能还需要定义一些 service 类，他们是在 整个 web request 请求链路上有效的类。既它们的生命周期很短，从 request 到 response 就会被销毁掉，再有请求会重新实例化。

这种请求链路上生效的类，在 Daruk 中我们用 `@service` 装饰器来定义，他有一个优势就是，可以在 service 中方便的拿到 ctx 上下文，而它本身又和 controller 类是解耦合的。

```typescript
@service()
class Logger {
  @inject("ctx") public ctx!: DarukContext;
  public info(msg) {
    let path = this.ctx.path;
    console.log(msg, path);
  }
}

@controller()
class Index {
  @inject("Logger") public logger;
  @get("/index")
  public async index(ctx: DarukContext, next: Next) {
    ctx.body = "index";
    this.logger.info("access index");
  }
}
```

这个场景很适合打印日志，以及传递 ctx 信息的一些场景，我们不需要层层调用透传参数就可以实现 方便的获取 调用的请求链路上下文。

## timer 装饰器

利用 timer 装饰器注入的定时任务类，可以方便的帮开发者实现简单的定时任务功能。

```typescript
@timer()
class MyTimer implements TimerClass {
  public cronTime!: string;
  public initTimer(daruk: Daruk) {
    this.cronTime = "* * * * * *";
  }
  public onTick(job: CronJob, daruk: Daruk) {
    // if you setup with pm2 cluster:
    // https://pm2.io/doc/en/runtime/guide/load-balancing/?utm_source=pm2&utm_medium=website&utm_campaign=rebranding#cluster-environment-variable
    // only run tick on NODE_APP_INSTANCE === '0';
    if (
      !process.env.NODE_APP_INSTANCE ||
      process.env.NODE_APP_INSTANCE === "0"
    ) {
      const unit = 1024;
      let freeMem = Math.round(freemem() / (unit * unit));
      daruk.logger.info({
        freeMem,
      });
    }
  }
  public onComplete(job: CronJob, daruk: Daruk) {
    // if you setup with pm2 cluster:
    // https://pm2.io/doc/en/runtime/guide/load-balancing/?utm_source=pm2&utm_medium=website&utm_campaign=rebranding#cluster-environment-variable
    // use the NODE_APP_INSTANCE to stop the task
    if (
      !process.env.NODE_APP_INSTANCE &&
      process.env.NODE_APP_INSTANCE !== "0"
    ) {
      job.stop();
    }
  }
}
```

## plugin 装饰器

最后我们来说一下 `@plugin` 装饰器，在 Daruk1.0 中用户是很难扩展 Daruk 本身的功能的，所以 2.0 之后 Daruk 实现了一个简单的插件机制，目前内部的内置功能很多也是基于 plugin 来实现的。

```typescript
@plugin()
class DarukExitHook implements PluginClass {
  public async initPlugin(daruk: Daruk) {
    let exitHook = new ExitHook({
      onExit: (err: Error | null) => {
        if (err) {
          daruk.prettyLog(err.stack || err.message, { level: "error" });
        }
        daruk.prettyLog("process is exiting");
        daruk.emit("exit", err, daruk);
      },
      onExitDone: (code: number) => {
        daruk.prettyLog(`process exited: ${code}`);
      },
    });
    return exitHook;
  }
}
```

通过 initPlugin 方法，我们可以在 plugin 类上拿到实例化后的 Daruk。然后我们就可以利用 Daruk 的生命周期和事件机制来实现一些功能了。上面就是进程退出钩子的插件实现。

plugin 类能实现的功能取决于 Daruk 对外开放的生命周期，详细的可以参考生命周期部分介绍。比如我们可以在 access 的生命周期中扩展 ctx 来实现一些通用功能等等, 一般只有高级开发者才会使用。

## resetful method 装饰器

Daruk 提供了符合 resetful 的所有 http 方法的 API 装饰器，可以在 controller 类的方法上使用：`get`,`post`,`del`,`put`,`patch`,`options`,`head`,`all`。

## request 装饰器

Daruk 提供了对请求进行操作的一些辅助功能装饰器，方便开发者开发 web 服务实现一些基础通用功能，比如 `validate`,`required` 他们都是对请求参数做校验的，`typeParse` 则是对请求体做格式转换的。

## response 装饰器

Daruk 也提供了对 response 做操作的一些辅助装饰器，比如 `prefix` 可以对 controller 类的所有 router 做矫正； `disable` 可以对 controller 的类和方法做禁用；`json`，`type`,`header` 可以对 header 做改写；`redirect` 可以直接做请求重定向；`cache` 则可以对接口做简单的缓存封装。
