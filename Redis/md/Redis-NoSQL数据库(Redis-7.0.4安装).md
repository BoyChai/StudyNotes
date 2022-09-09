# 环境

Rocky8.5 防火墙selinux都关闭 

gcc (GCC) 8.5.0 20210514 (Red Hat 8.5.0-3)

GNU Make 4.2.1

redis-7.0.4.tar.gz

> gcc和make可以直接使用yum安装，redis的包在官网下载即可

# 安装

```bash
# 上传redis-7.0.4.tar.gz
[root@redis ~]# ls redis-7.0.4.tar.gz
redis-7.0.4.tar.gz

# 解压
[root@redis ~]# tar xf redis-7.0.4.tar.gz

# 编译
[root@redis ~]# cd redis-7.0.4
[root@redis redis-7.0.4]# make
......
Hint: It's a good idea to run 'make test' ;)
make[1]: Leaving directory '/root/redis-7.0.4/src'

# 安装
[root@redis redis-7.0.4]# make install
......
make[1]: Leaving directory '/root/redis-7.0.4/src'

# 查看安装命令
[root@redis redis-7.0.4]# ls /usr/local/bin/|grep redis
redis-benchmark
redis-check-aof
redis-check-rdb
redis-cli
redis-sentinel
redis-server
```

# 命令

| 命令            | 介绍                                               |
| --------------- | -------------------------------------------------- |
| redis-benchmark | 性能测试工具，可以在自己本地运行，用来测试本机性能 |
| redis-check-aof | 修复有问题的AOF文件                                |
| redis-check-rdb | 修复有问题的rdb文件                                |
| redis-sentinel  | Redis集群使用                                      |
| redis-server    | Redis服务器启动命令                                |
| redis-cli       | 客户端连接工具                                     |

# 启动

```bash
# 前台启动，前台不能关闭
[root@redis ~]# redis-server
......
                _._
           _.-``__ ''-._
      _.-``    `.  `_.  ''-._           Redis 7.0.4 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 14388
  `-._    `-._  `-./  _.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |           https://redis.io
  `-._    `-._`-.__.-'_.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |
  `-._    `-._`-.__.-'_.-'    _.-'
      `-._    `-.__.-'    _.-'
          `-._        _.-'
              `-.__.-'
......

# 后台启动
# 后台启动需要使用配置文件启动
# 把源码包的redis.conf复制到/etc下,之后修改"daemonize on"为yes,大概在309行
[root@redis ~]# cp redis-7.0.4/redis.conf /etc/redis.conf
[root@redis ~]# vim /etc/redis.conf
......
daemonize yes
......
[root@redis ~]# redis-server /etc/redis.conf
```

# 连接

```bash
# 使用redis-cli进行连接
# 启动之后默认会监听127.0.0.1的6379端口
# 默认redis-cli不加任何参数就会去链接127.0.0.1:6379
# 输入ping返回pong代表成功
[root@redis ~]# redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> exit
[root@redis ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> exit
```

# 关闭

```bash
# 使用redis-cli进行关闭
[root@redis ~]# redis-cli shutdown
[root@redis ~]# redis-cli
Could not connect to Redis at 127.0.0.1:6379: Connection refused

# 使用kill
[root@redis ~]# ps -aux|grep redis
root       18982  0.0  0.2  62632 10044 ?        Ssl  04:22   0:00 redis-server                                                                               127.0.0.1:6379
root       19048  0.0  0.0  12136  1104 pts/1    S+   04:22   0:00 grep --color=                                                                              auto redis
[root@redis ~]# ps -aux|grep redis
root       18982  0.0  0.2  62632 10044 ?        Ssl  04:22   0:00 redis-server 127.0.0.1:6379
root       19074  0.0  0.0  12136  1136 pts/1    S+   04:22   0:00 grep --color=auto redis
[root@redis ~]# kill -9 18982
[root@redis ~]# redis-cli
Could not connect to Redis at 127.0.0.1:6379: Connection refused
```

