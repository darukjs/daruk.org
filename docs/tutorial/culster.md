# cluster

Daruk 目前没有提供进程管理功能，我们建议使用 PM2 进行生产环境的多进程启动，这里需要注意的一点是，PM2 启动后，Timers 也会启动多个，可以使用 PM2 内置的[pm2 instances](http://pm2.keymetrics.io/docs/usage/cluster-mode/)来进行任务区分。
