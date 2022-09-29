# Hadoop概述

Hadoop是Apache软件基金会的一款开源软件，使用java编写，开源允许用户使用简单的编程模型实现跨机器集群对海量数据进行分布式计算处理。

**官网**：https://hadoop.apache.org/

# Hadoop核心组件

- Hadoop HDFS（分布式文件存储系统）：解决海量数据存储

- Hadoop YARN（集群资源管理和任务调度框架）：解决资源任务调度

- Hadoop MapReduce（分布式计算框架）：解决海量数据计算

# Hadoop生态

![Hadoop生态](https://image.boychai.xyz/article/Hadoop_Ecology.png)

# Hadoop发展史

- Hadoop之父：Doug Cutting
- Hadoop起源于Apache Lucene子项目：Nutch

Nutch的设计目标是构建一个大型的全网搜索引擎。遇到瓶颈：如何解决数十亿网页的存储和索引问题

# Hadoop现状

HDFS作为分布式文件存储系统，处在生态圈的底层与核心地位；

YARN作为分布式通用的集群资源管理系统和任务调度平台，支撑各种计算引擎运行，保证了Hadoop地位；

MapReduce作为大数据生态圈第一代分布式计算引擎，由于自身设计的模型所产生的弊端，导致企业一线几乎不再直接使用MapReduce进行编程处理，但是很多软件的底层依然在使用MapReduce引擎来处理数据。

# Hadoop特性

- 扩容能力
Hadoop是在可用的计算机集群间分配数据并完成计算任务的，这些集群可方便灵活的方式扩展到数以千计的节点。
- 成本低
Hadoop集群允许通过部署普通廉价的机器组成集群来处理大数据，以至于成本很低。看重的是集群整体能力。
- 效率高
通过并发数据，Hadoop可以在节点之间动态并行的移动数据，使得速度非常快。
- 可靠性
能自动维护数据的多份复制，并且在任务失败后能自动地重新部署（redeploy）计算任务。所以Hadoop的按位存储和处理数据的能力值得人们信赖。

# Hadoop应用

- **Yahoo**

支持广告系统

用户行为分析

支持Web搜索

反垃圾邮件系统

- **Facebook**

存储处理数据挖掘和日志统计

构建基于Hadoop数据仓库平台（Apache Hive来自FB）

- **IBM**

蓝云基础设施构建

商业化Hadoop发行、解决方案支持

- **百度**

用户搜索表征的需求数据、阿拉丁爬虫数据存储

数据分析和挖掘竞价排名

- **阿里巴巴**

为电子商务网络平台提供底层的基础计算和存储服务

交易数据、信用数据

- **腾讯**

用户关系数据

基于Hadoop、Hive构建TDW（腾讯分布式数据仓库）

- **华为**

对Hadoop的HA方案，以及HBase领域有深入研究

# Hadoop发行版本

- 开源社区版

Apache开源社区发行

也是官方发行版本

优点：更新迭代快

缺点：兼容稳定性不周

http://hadoop.apache.org/

- 商业发行版

商业公司发行

基于Apache开源协议

某些服务需要收费

优点：稳定兼容好

缺点：收费版本更新慢

Cloudera：https://www.cloudera.com/products/open-source/apache-hadoop.html

Hortonworks ：https://www.cloudera.com/products/hdp.html

# Hadoop架构变迁

## 1.0-2.0

- Hadoop 1.0

  ​	HDFS（分布式文件存储）

  ​	MapReduce（资源管理和分布式数据处理）

-  Hadoop 2.0

  ​	HDFS（分布式文件存储）

  ​	MapReduce（资源管理和分布式数据处理）

  ​	YARN（集群资源管理，任务调度）

![Hadoop生态](https://image.boychai.xyz/article/Hadoop-Changes1-2.png)

## 3.0

Hadoop 3.0架构组件和Hadoop2.0类似，3.0着重于性能优化。

- 通用方面

  ​	精简内核、类路径隔离、Shell脚本重构

- Hadoop HDFS

  ​	EC纠删码、多NameNode支持

- Hadoop MapReduce

  ​	任务本地化优化、内存参数自动推断

- Hadoop YARN

  ​	Timeline Service V2、列队配置