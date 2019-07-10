# timers

在实际应用中，我们有很多时候需要依赖定时任务来解决问题，例如：

1. 定时检测机器状态，性能
2. 定时更新缓存

类似的，daurk 会以 timers 下文件夹名字或者文件的名字作为 timer 的名字。文件或者文件夹中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数需要返回 timer 的配置：

```ts
import { Daruk } from "daruk";

export default (daruk: Daruk) => {
  return {
    cronTime: "* * * * * *", // 一秒一次
    onTick: function onTick(this: any) {
      daruk.logger.info("mytimer onTick");
      this.stop(); // 停止时会进入 onComplete
    },
    onComplete: function onComplete() {
      daruk.logger.info("mytimer onComplete");
    }
  };
};
```

如果注释掉语句

```ts
this.stop(); // 停止时会进入complete
```

那么控制台就会每隔一秒中打印一次以上信息。
