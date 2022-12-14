# 概述

主机数据更新后根据配置和策略， 自动同步到备机的 ***master/slaver*** 机制，***Master*** 以写为主，***Slaver*** 以读为主。

# 作用

1. 读写分离，性能扩展
2. 容灾快速恢复
3. 一主多从！

# 搭建一主两从

三台Redis，主节点无需操作，从节点需要连接redis之后执行一下命令

```bash
slaveof  <ip> <port> # 成为某个实例的从服务器
info replication # 查看状态role是slave即可
```

# 一主二仆

当主节点挂掉或者宕机了之后，slave节点不会进行上位变成主节点。

# 薪火相传

上一个 ***slave*** 可以是下一个 ***slave*** 的 ***master***，***slave*** 同样可以接收其他 ***slave***的连接和同步请求，那么该 ***slave*** 作为了链条中下一个的 ***master***，可以有效减轻 ***master*** 的写压力，去中心化降低风险。

```bash
# 链接从redis执行
slaveof <ip> <port> 
```

中途变更转向：会清除之前的数据，重新建立拷贝最新的。

当某个 ***slave*** 宕机，后面的 ***slave*** 都没法备份。

即当主机挂掉，从机还是从机，但是无法继续写数据。

# 反客为主

当一个 ***master*** 宕机后，后面的 ***slave*** 可以立刻升为 ***master***，其后面的 ***slave*** 不用做任何修改。

```bash
# 链接从redis执行
slaveof no one
```

# 哨兵模式

**反客为主的自动版**，即能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库。

## 配置

 建立一个sentinel.conf文件，内容如下

```sentinel.conf
sentinel monitor mymaster 172.16.88.168 6379 1

# mymaster：监控对象起的服务器名称
# 1：至少有多少个哨兵同意迁移的数量。 
```

在redis的配置文件中配置

```redis.conf
redis-sentinel <sentinel.conf文件位置>
```

## 选举规则

- 根据优先级别，***slave-priority/replica-priority***，优先选择优先级靠前的。

```redis.conf
replica-priority 100 ## 在从redis配置文件中
```

- 根据偏移量，优先选择偏移量大的。
- 根据 ***runid***，优先选择最小的服务。

## 复制延时

由于所有的写操作都是先在 ***master*** 上操作，然后同步更新到 ***slave*** 上，所以从 ***master*** 同步到 ***slave*** 从机有一定的延迟，当系统很繁忙的时候，延迟问题会更加严重，***slave*** 机器数量的增加也会使这个问题更加严重。

## 复制原理

- ***slave*** 启动成功连接到 ***master*** 后会发送一个 ***sync*** 命令（同步命令）。
- ***master*** 接到命令启动后台的存盘进程，对数据进行持久化操作，同时收集所有接收到的用于修改数据集命令，在后台进程执行完毕之后，***master*** 将传送整个数据文件（***rdb***）到 ***slave***，以完成一次完全同步。
- 当主服务进行写操作后，和从服务器进行数据同步。
- 全量复制：而 ***slave*** 服务在接收到数据库文件数据后，将其存盘并加载到内存中。
- 增量复制：***master*** 继续将新的所有收集到的修改命令依次传给 ***slave***，完成同步。
- 只要是重新连接 ***master***，一次完全同步（全量复制）将被自动执行。