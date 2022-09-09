

# 简单操作

**设置key**

使用命令`set <key> <value>`来创建一个key

```bash
127.0.0.1:6379> set k1 v1
OK
```

**查看key**

通过命令`get <key>`来查看key数据

```bash
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> get k1
"v1"
```



**切换数据库**

Redis默认16个数据库，类似数组从0开始，默认操作使用0号数据库

使用命令`select <dbid>`来切换数据库，操作如下

```bash
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> select 2
OK
127.0.0.1:6379[2]> select 0
OK
```

**查看key数量**

使用命令`dbsize`查看当前数据库的key数量

```bash
127.0.0.1:6379> DBSIZE
(integer) 1
```

**查看当前库中所有key**

使用命令`keys *`来查看当前库中所有的key

```bash
127.0.0.1:6379> keys *
1) "k1"
```

**判断某个key是否存在**

使用命令`exists <key>`来查看某个key是否存在

```bash
127.0.0.1:6379> exists k1
(integer) 1
```

**查看key类型**

通过命令`type <key>`来查看key是什么类型

```bash
127.0.0.1:6379> type k1
string
```

**删除key**

通过命令`del <key>`来删除key数据

```bash
127.0.0.1:6379> del k1
(integer) 1
```

**根据value选择非阻塞删除**

使用命令`unlink <key>`不阻塞删除key

和`del <key>`效果一样都是删除对应key,不同的是使用非阻塞删除会在后续异步进行操作，不卡主线程

```bash
127.0.0.1:6379> UNLINK k1
(integer) 1
```

**给key设定过期时间**

通过命令`expire <key> <时间(s)>`来设置过期时间

```bash
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> EXPIRE k1 10
(integer) 1
# 等待十秒查看
127.0.0.1:6379> get k1
(nil)
```

**查看还剩多少秒过期**

通过命令`ttl <key>`来查看某个key还剩多少时间过期

-1表示永不过期，-2表示已经过期

```bash
127.0.0.1:6379> expire k1 60
(integer) 1
127.0.0.1:6379> ttl k1
(integer) 57
```

**清空当前库**

使用命令`flushdb`来清空当前库的key

```bash
127.0.0.1:6379> FLUSHDB
OK
```

**清空全部库**

使用命令`flushall`来清空全部库的key

```bash
127.0.0.1:6379> FLUSHALL
OK
```

# 分类

下面是常用数据类型

1、string(字符串)是redis最常用的类型，可以包含任何数据，一个key对应一个value，在Rediss中是二进制安全的。

2、hash(哈希)是一个string 类型的field和value的映射表，适合被用于存储对象。

3、list(列表)是一个链表结构，按照插入顺序排序。

4、set(集合)是 string 类型的无序集合。

5、zset(有序集合)是string类型元素的集合,zset是插入有序的，即自动排序。

下面是新数据类型

1、Bitmaps，二进制存储

2、HyperLogLog，基数

3、Geospatial，坐标

# String(字符串)

## 简介

String是Redis最基本的类型，可以理解为memcached一模一样的类型，一个key对应一个value。string类型是二进制安全的，一位置redis的string可以包含任何数据。比如jpg图片或者序列化的对象。一个Redis字符串value最多可以存储512M。

## 常用命令

> `set <key> <value> `：添加键值对
>
> `get <key>`： 查询对应键值
>
> `appen <key> <value>`：将value的值追加到原本value的末尾
>
> `strlen <key>`：获取键的长度
>
> `setnx <key> <value>`：当key不存在时设置键值对，如果key存在则不会设置
>
> `incr <key>`：将key中存储的数字值+1(前提是字符串里面全部存储的数字)
>
> `decr <key>：`将key中存储的数字值-1(前提是字符串里面全部存储的数字)
>
> `incrby / decrby <key> <步长>`和`incr / decr <key>`：都是对数字值进行加减，不同的是crby可以设置增减大小(步长)
>
> `mset <key1> <value1> <key2> <value2>`：同时设置一个或多个键值对
>
> `mget <key1> <value1> <key2> <value2>`：同时获取一个或多个value
>
> `msetnx <key1> <value1> <key2> <value2>：`同时设置一个或多个键值对，并且key是不存在的，存在会操作失败(有一个失败全部失败)
>
> `getrange <key> <起始位置> <结束位置>`获得值的范围
>
> `setrange <key> <起始位置> <value>`覆盖原始value的值(覆盖的是从起始位置到新value的长度)
>
> `setex <key> <过期时间> <value>`设置键值的同时设定过期时间
>
> `getset <key> <value>`以旧换新，设置新值并获取旧值

## 数据结构

string的数据结构为简单动态字符串。是可以修改的字符串，内部结构实现上类似于java的ArrayList，采用预分配冗余的方式来减少内存的频繁分配。当字符串长度小于1m时，会进行扩容，扩容都是加倍现有空间，如果超过1m则扩容时一次只会多扩1m的空间，要住的是字符串最大长度为512m。

# List(列表)

## 简介

单键多值。Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部(左边)或者尾部(右边)。它的底层实际是个双向链表，对两端的操作性很高，通过索引下标的操作中间的节点性能会较差。

## 常用命令

> `lpush/rpush <key><value1><value2><value3> ....`： 从左边/右边插入一个或多个值。
>
> `lpop/rpop <key>`：从左边/右边吐出一个值。值在键在，值光键亡。
>
> `rpoplpush <key1><key2>`：从 ***<key1>*** 列表右边吐出一个值，插到 ***<key2>*** 列表左边。
>
> `lrange <key><start><stop>`：按照索引下标获得元素（从左到右）
>
> `lrange mylist 0 -1 0`：左边第一个，-1右边第一个，（0 -1表示获取所有）
>
> `lindex <key><index>`：按照索引下标获得元素（从左到右）
>
> `llen <key>`：获得列表长度
>
> `linsert <key> before/after <value><newvalue>`：在 ***<value>*** 的前面/后面插入 ***<newvalue>*** 插入值
>
> `lrem <key><n><value>`：从左边删除 ***n*** 个 ***value***（从左到右）
>
> `ltrim <key><start><end>`：按照索引截取下标元素（从左到右）
>
> `lset<key><index><value>`：将列表 ***key*** 下标为 ***index*** 的值替换成 ***value***

## 数据结构

***List*** 的数据结构为快速链表 ***quickList***。

首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是 ***ziplist***，也即是压缩列表。

它将所有的元素紧挨着一起存储，分配的是一块连续的内存。

当数据量比较多的时候才会改成 ***quicklist***。

因为普通的链表需要的附加指针空间太大，会比较浪费空间。比如这个列表里存的只是 ***int*** 类型的数据，结构上还需要两个额外的指针 ***prev*** 和 ***next***。

***Redis*** 将链表和 ***ziplist*** 结合起来组成了 ***quicklist***。也就是将多个 ***ziplist*** 使用双向指针串起来使用。这样既满足了快速的插入删除性能，又不会出现太大的空间冗余。

# Set(合集)

## 简介

**Set**对外提供的功能和list类似，是一个列表的功能，特殊之处在于**Set**是可以**自动排重**的，当需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择。Set是string类型的**无序集合**。**它的底层其实是一个value为null的hash表**，所以添加、删除、查找的复杂程度都是**O(1)**。一个算法，随着数据的增加，执行时间的长短，如果是 ***O(1)***，数据增加，查找数据的时间不变。

## 常用命令

> `sadd <key><value1><value2> ..... `：将一个或多个 ***member*** 元素加入到集合 ***key*** 中，已经存在的 ***member*** 元素将被忽略
>
> `smembers <key>`：取出该集合的所有值。
>
> `sismember <key><value>`：判断集合 ***<key>*** 是否为含有该 ***<value>*** 值，有返回 1，没有返回 0
>
> `scard<key>`：返回该集合的元素个数。
>
> `srem <key><value1><value2> ....`：删除集合中的某个元素
>
> `spop <key>`：随机从该集合中吐出一个值
>
> `srandmember <key><n>`：随机从该集合中取出 ***n*** 个值，不会从集合中删除
>
> `smove <source><destination>value`：把集合中一个值从一个集合移动到另一个集合
>
> `sinter <key1><key2>`：返回两个集合的交集元素
>
> `sunion <key1><key2>`：返回两个集合的并集元素
>
> `sdiff <key1><key2>`：返回两个集合的差集元素（***key1*** 中的，不包含 ***key2*** 中的）

## 数据结构

***Set*** 数据结构是字典，字典是用哈希表实现的。

# Hash(哈希)

## 简介

**Hash**是一个键值的合集。**Hash**是一个string类型的**field**和**value**的映射表，**Hash**特别适合用于存储对象。

## 常用命令

> `hset <key><field><value>`：给 ***<key>*** 集合中的 ***<field>*** 键赋值 ***<value>***
>
> `hget <key1><field>`：从 ***<key1>*** 集合 ***<field>*** 取出 ***value***
>
> `hmset <key1><field1><value1><field2><value2>...`： 批量设置 ***hash*** 的值
>
> `hexists <key1><field>`：查看哈希表 ***key*** 中，给定域 ***field*** 是否存在
>
> `hkeys <key>`：列出该 ***hash*** 集合的所有 ***field***
>
> `hvals <key>`：列出该 ***hash*** 集合的所有 ***value***
>
> `hincrby <key><field><increment>`：为哈希表 ***key*** 中的域 ***field*** 的值加上增量 1 -1
>
> `hsetnx <key><field><value>`：将哈希表 ***key*** 中的域 ***field*** 的值设置为 ***value*** ，当且仅当域 ***field*** 不存在

## 数据结构

***Hash*** 类型对应的数据结构是两种：***ziplist***（压缩列表），***hashtable***（哈希表）。当 ***field-value*** 长度较短且个数较少时，使用 ***ziplist***，否则使用 ***hashtable***。

# Zset(有序集合)

## 简介

***Redis*** 有序集合 ***zset*** 与普通集合 ***set*** 非常相似，是一个没有重复元素的字符串集合。不同之处是有序集合的每个成员都关联了一个评分（***score***）,这个评分（***score***）被用来按照从最低分到最高分的方式排序集合中的成员。集合的成员是唯一的，但是评分可以是重复的。因为元素是有序的，所以可以很快的根据评分（***score***）或者次序（***position***）来获取一个范围的元素。访问有序集合的中间元素也是非常快的，因此能够使用有序集合作为一个没有重复成员的智能列表。

## 常用命令

> `zadd <key><score1><value1><score2><value2>…`：将一个或多个 ***member*** 元素及其 ***score*** 值加入到有序集 ***key*** 当中
>
> `zrange <key><start><stop> [WITHSCORES] `：返回有序集 ***key*** 中，下标在 ***<start><stop>*** 之间的元素
>
> 当带 ***WITHSCORES***，可以让分数一起和值返回到结果集
>
> `zrangebyscore key min max [withscores] [limit offset count]`：返回有序集 ***key*** 中，所有 ***score*** 值介于 ***min*** 和 ***max*** 之间（包括等于 ***min*** 或 ***max*** ）的成员。有序集成员按 ***score*** 值递增（从小到大）次序排列。
>
> `zrevrangebyscore key max min [withscores] [limit offset count] `：同上，改为从大到小排列
>
> `zincrby <key><increment><value>`：为元素的 ***score*** 加上增量
>
> `zrem <key><value>`：删除该集合下，指定值的元素
>
> `zcount <key><min><max>`：统计该集合，分数区间内的元素个数
>
> `zrank <key><value>`：返回该值在集合中的排名，从 0 开始。

## 数据结构

***SortedSet（zset）***是 ***Redis*** 提供的一个非常特别的数据结构，一方面它等价于 ***Java*** 的数据结构 ***Map<String, Double>***，可以给每一个元素 ***value*** 赋予一个权重 ***score***，另一方面它又类似于 ***TreeSet***，内部的元素会按照权重 ***score*** 进行排序，可以得到每个元素的名次，还可以通过 ***score*** 的范围来获取元素的列表。

***zset*** 底层使用了两个数据结构

- ***hash***，***hash*** 的作用就是关联元素 ***value*** 和权重 ***score***，保障元素 ***value*** 的唯一性，可以通过元素 ***value*** 找到相应的 ***score*** 值
- 跳跃表，跳跃表的目的在于给元素 ***value*** 排序，根据 ***score*** 的范围获取元素列表

# Bitmaps

## 概述

Redis 提供了 Bitmaps 这个 “数据类型” 可以实现对位的操作：

- Bitmaps 本身不是一种数据类型， 实际上它就是字符串（key-value） ， 但是它可以对字符串的位进行操作。
- Bitmaps 单独提供了一套命令， 所以在 Redis 中使用 Bitmaps 和使用字符串的方法不太相同。 可以把 Bitmaps 想象成一个以位为单位的数组， 数组的每个单元只能存储 0 和 1， 数组的下标在 Bitmaps 中叫做偏移量。

## 常用命令

> `setbit <key> <offset> <value>`：设置Bitmaps中某个偏移量的值（0或1）
>
> `getbit <key> <offset>`：获取Bitmaps中某个偏移量的值
>
> `bitcount <key> [start end]`：统计字符串从start字节到end字节比特值为1的数量
>
> `bitop and(or/not/xor) <destkey> [key…]`：它可以做多个Bitmaps的and（交集） 、 or（并集） 、 not（非） 、 xor（异或） 操作并将结果保存在destkey中。

# HyperLoglog

## 概述

Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

## 常用命令

> `pfadd <key>< element> [element ...]`： 添加指定元素到 HyperLogLog 中。
>
> `pfcount<key> [key ...]`：计算HLL的近似基数，可以计算多个HLL，比如用HLL存储每天的UV，计算一周的UV可以使用7天的UV合并`计算即可。
>
> `pfmerge <destkey> <sourcekey> [sourcekey ...]`：将一个或多个HLL合并后的结果存储在另一个HLL中，比如每月活跃用户可以使·用每天的活跃用户来合并计算可得。

# Geospatial

## 概述

Redis 3.2 中增加了对GEO类型的支持。GEO，Geographic，地理信息的缩写。该类型，就是元素的2维坐标，在地图上就是经纬度。redis基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度Hash等常见操作。

## 常用命令

> `geoadd <key> < longitude> <latitude> <member> [longitude latitude member...]`： 添加地理位置（经度，纬度，名称）
>
> `geopos  <key> <member> [member...]`：获得指定地区的坐标值
>
> `geodist <key> <member1> <member2> [m|km|ft|mi ]`：获取两个位置之间的直线距离
>
> `georadius <key> <longitude> <latitude> radius m|km|ft|mi`：以给定的经纬度为中心，找出某一半径内的元素