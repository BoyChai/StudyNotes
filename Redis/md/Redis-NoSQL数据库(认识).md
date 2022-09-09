# Redis概述

Redis 是一个开源（BSD 许可）的内存**数据结构存储**，用作数据库、缓存、消息代理和流引擎。Redis 提供[数据结构](https://redis.io/docs/data-types/)，例如 [字符串](https://redis.io/docs/data-types/strings/)、[散列](https://redis.io/docs/data-types/hashes/)、[列表](https://redis.io/docs/data-types/lists/)、[集合](https://redis.io/docs/data-types/lists/)、带范围查询的[排序集合、](https://redis.io/docs/data-types/sorted-sets/)[位图](https://redis.io/docs/data-types/bitmaps/)、[超日志](https://redis.io/docs/data-types/hyperloglogs/)、[地理空间索引](https://redis.io/docs/data-types/geospatial/)和[流](https://redis.io/docs/data-types/streams/)。Redis 内置了[复制](https://redis.io/topics/replication)、[Lua 脚本](https://redis.io/commands/eval)、[LRU 驱逐](https://redis.io/topics/lru-cache)、[事务](https://redis.io/topics/transactions)和不同级别的[磁盘持久性](https://redis.io/topics/persistence)，并通过[Redis Sentinel](https://redis.io/topics/sentinel)和[Redis Cluster](https://redis.io/topics/cluster-tutorial)自动分区提供高可用性。

# Redis特点

- Redis是一个**开源**的**key-value**存储系统。
- 和Memcached类似，它支持存储的value类型相对更多，包括**string(字符串)**、**list(链表)**、**set(合集)**、**zset(sorted set 有序合集)**和**hash(哈希类型)。**
- 这些数据类型都支持 push/pop、add/remove及其交集并集和差集更丰富的操作，而且这些操作都是**原子性**的。
- 在此基础上，Redis支持各种不同方式的排序。
- 与Memcached一样，为了保证效率，数据都是缓存在内存中。
- Redis会周期性的把更新的数据写入磁盘或者把修改操作写入最佳到记录文件。
- 可实现master-slave主从同步

# 应用场景

- 高频次，热门访问的数据，降低数据库IO
- 分布式架构，做session共享
- 消息队列
- 计数器、秒杀
- 发布订阅消息系统
- 时效性的数据、比如消息验证码