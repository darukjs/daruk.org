# config

`config` 目录用于定义项目的配置，config 目录中的 index.ts 需要导出一个函数，函数的参数是 daruk 实例，函数的返回值就是项目的配置，然后就可以在各个地方通过 `daruk.config`、`ctx.config` 访问了。

```typescript
// src/config/index.ts

// 其他内容省略...
export default function(daruk) {
  return config;
}
```
