# 生命周期

整个 Daruk 的生命周期分为两条线路，一条是应用的初始化生命周期，分别是`initOptions`,`init`,`routerUseBefore`,`serverReady`,`exit`。另外一条是访问的，目前在内置中间件中有一个 `access` 事件。
