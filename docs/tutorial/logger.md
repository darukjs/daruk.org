# 日志

## logger

##### Desc: 日志输出

##### Example:

```javascript
// daruk.logger 只是对 daruk-logger 实例的引用
// daruk-logger 文档：https://github.com/darukjs/daruk-logger
daruk.logger.warn("warn message"); // 警告日志
daruk.logger.error({ message: "error message" }); // 错误日志，Object 会被 stringify
daruk.logger.info(); // 普通日志
daruk.logger.debug(); // debug日志
```

// 日志输格式

```json
{
  "level": "warn",
  "logType": "myapp",
  "fileinfo": "/src/index.ts:283:25",
  "msg": "message",
  "os_hostname": "hahahh.local",
  "timestamp": 1538020260774
}
```
