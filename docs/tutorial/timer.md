# timers

在实际应用中，我们有很多时候需要依赖定时任务来解决问题，例如：

1. 定时检测机器状态，性能
2. 定时更新缓存

类似的，daurk 会以 timers 下文件夹名字或者文件的名字作为 timer 的名字。文件或者文件夹中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数需要返回 timer 的配置：

```ts
/**
* 这里使用的linux下的corntab进程
* 新手请自行百度
*/
export default function() {
  return {
    cronTime: "* * * * * *", //一秒一次
    // 定时器触发的回调
    onTick: function(this: any) {
      // 可以手动停止定时器
      this.stop();
    },
    // 定时器完成的回调
    onComplete: function() {}
  };
}
```
