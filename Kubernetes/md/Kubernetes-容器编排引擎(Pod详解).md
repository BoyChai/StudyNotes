# Kubernetes-容器编排引擎(Pod详解)

## 概述Pod

###  什么是Pod?

**Pod** 是在 Kubernetes 中创建和管理的、最小的可部署的计算单元。**Pod**（就像在鲸鱼荚或者豌豆荚中）是一组（一个或多个） [容器](https://kubernetes.io/zh-cn/docs/concepts/overview/what-is-kubernetes/#why-containers)； 这些容器共享存储、网络、以及怎样运行这些容器的声明。 Pod 中的内容总是并置（colocated）的并且一同调度,在共享的上下文中运行。 Pod 所建模的是特定于应用的 “逻辑主机”,其中包含一个或多个应用容器, 这些容器相对紧密地耦合在一起。 在非云环境中,在相同的物理机或虚拟机上运行的应用类似于在同一逻辑主机上运行的云应用。

### Pod的结构

![结构](https://image.boychai.xyz/article/Kubernetes_pod_1.png)

每一个Pod都可以包含一个或者多个容器,这些容器分为两种:

- 程序容器,业务容器,数量可多可少
- Pause容器,这是每个Pod都会有的一个根容器,他的作用有两个:
  - 可以以它为依据,评估整个Pod的健康状态
  - 可以在跟容器上设置ip地址,其他容器都用此ip(Pod IP),以实现Pod内部的网络通信 

### 资源清单

```
apiVersion: v1     #必选,版本号,例如v1
kind: Pod       　 #必选,资源类型,例如 Pod
metadata:       　 #必选,元数据
  name: string     #必选，Pod名称
  namespace: string  #Pod所属的命名空间,默认为"default"
  labels:       　　  #自定义标签列表
    - name: string      　          
spec:  #必选，Pod中容器的详细定义
  containers:  #必选，Pod中容器列表
  - name: string   #必选,容器名称
    image: string  #必选,容器的镜像名称
    imagePullPolicy: [ Always|Never|IfNotPresent ]  #获取镜像的策略 
    command: [string]   #容器的启动命令列表,如不指定,使用打包时使用的启动命令
    args: [string]      #容器的启动命令参数列表
    workingDir: string  #容器的工作目录
    volumeMounts:       #挂载到容器内部的存储卷配置
    - name: string      #引用pod定义的共享存储卷的名称,需用volumes[]部分定义的的卷名
      mountPath: string #存储卷在容器内mount的绝对路径,应少于512字符
      readOnly: boolean #是否为只读模式
    ports: #需要暴露的端口库号列表
    - name: string        #端口的名称
      containerPort: int  #容器需要监听的端口号
      hostPort: int       #容器所在主机需要监听的端口号,默认与Container相同
      protocol: string    #端口协议,支持TCP和UDP，默认TCP
    env:   #容器运行前需设置的环境变量列表
    - name: string  #环境变量名称
      value: string #环境变量的值
    resources: #资源限制和请求的设置
      limits:  #资源限制的设置
        cpu: string     #Cpu的限制,单位为core数,将用于docker run --cpu-shares参数
        memory: string  #内存限制,单位可以为Mib/Gib，将用于docker run --memory参数
      requests: #资源请求的设置
        cpu: string    #Cpu请求,容器启动的初始可用数量
        memory: string #内存请求,容器启动的初始可用数量
    lifecycle: #生命周期钩子
		postStart: #容器启动后立即执行此钩子,如果执行失败,会根据重启策略进行重启
		preStop: #容器终止前执行此钩子,无论结果如何,容器都会终止
    livenessProbe:  #对Pod内各容器健康检查的设置,当探测无响应几次后将自动重启该容器
      exec:       　 #对Pod容器内检查方式设置为exec方式
        command: [string]  #exec方式需要制定的命令或脚本
      httpGet:       #对Pod内个容器健康检查方法设置为HttpGet，需要制定Path、port
        path: string
        port: number
        host: string
        scheme: string
        HttpHeaders:
        - name: string
          value: string
      tcpSocket:     #对Pod内个容器健康检查方式设置为tcpSocket方式
         port: number
       initialDelaySeconds: 0       #容器启动完成后首次探测的时间,单位为秒
       timeoutSeconds: 0    　　    #对容器健康检查探测等待响应的超时时间,单位秒,默认1秒
       periodSeconds: 0     　　    #对容器监控检查的定期探测时间设置,单位秒,默认10秒一次
       successThreshold: 0
       failureThreshold: 0
       securityContext:
         privileged: false
  restartPolicy: [Always | Never | OnFailure]  #Pod的重启策略
  nodeName: <string> #设置NodeName表示将该Pod调度到指定到名称的node节点上
  nodeSelector: obeject #设置NodeSelector表示将该Pod调度到包含这个label的node上
  imagePullSecrets: #Pull镜像时使用的secret名称,以key：secretkey格式指定
  - name: string
  hostNetwork: false   #是否使用主机网络模式,默认为false，如果设置为true，表示使用宿主机网络
  volumes:   #在该pod上定义共享存储卷列表
  - name: string    #共享存储卷名称 （volumes类型有很多种）
    emptyDir: {}       #类型为emtyDir的存储卷,与Pod同生命周期的一个临时目录。为空值
    hostPath: string   #类型为hostPath的存储卷,表示挂载Pod所在宿主机的目录
      path: string      　　        #Pod所在宿主机的目录,将被用于同期中mount的目录
    secret:       　　　#类型为secret的存储卷,挂载集群与定义的secret对象到容器内部
      scretname: string  
      items:     
      - key: string
        path: string
    configMap:         #类型为configMap的存储卷,挂载预定义的configMap对象到容器内部
      name: string
      items:
      - key: string
        path: string
```

## Pod配置

### 基本配置

创建一个名字为Pod-Basic.yaml文件,内容如下:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-basic
  namespace: default
  labels:
    app: pod
spec:
  containers:
  - name: mynginx
    image: docker.io/library/nginx:1.23.1
  - name: mybusybox
    image: docker.io/library/busybox:1.35.0
```

上面定义了一个比较简单Pod的配置,名字叫做"pod-basic",命名空间在"default"下, 并给他打了一个标签叫做"app:pod",并定义了两个容器:

- mynginx: 使用docker镜像仓库的nginx镜像版本为1.23.1
- busybox: 使用docker镜像仓库的busybox镜像版本为2.4.54

定义好资源清单之后可以使用下面的命令进行管理:

```bash
# 创建pod
[root@master yaml]# kubectl create -f Pod-Basic.yaml
pod/pod-basic created

# 查看pod状态
# "-n default"是指定命名空间,这里不加也可以查询到,因为不加默认查询的就是default命名空间下的资源
# READY 1/2 表示当前Pod中有2个容器,其中1个准备就绪,1个未就绪
# RESTARTS  重启次数,因为有1个容器故障了，Pod一直在重启试图恢复它
[root@master yaml]# kubectl get pod -n default
NAME            READY   STATUS     RESTARTS      AGE
pod-basic       1/2     NotReady   2 (29s ago)   43s

# 查看pod的详细信息
[root@master yaml]# kubectl describe pod pod-basic -n default
```



### 镜像拉取

创建Pod-ImagePull.yaml文件,内容如下:

```bash
apiVersion: v1
kind: Pod
metadata:
  name: pod-imagepull
  namespace: default
spec:
  containers:
  - name: mynginx
    image: docker.io/library/nginx:1.23.1
    imagePullPolicy: Always                                     # 设置镜像拉取策略
  - name: mybusybox
    image: docker.io/library/busybox:2.4.54
```

imagePullPolicy，用于设置镜像拉取策略，kubernetes支持配置三种拉取策略：

- Always：总是从远程仓库拉取镜像（一直远程下载）
- IfNotPresent：本地有则使用本地镜像,本地没有则从远程仓库拉取镜像（本地有就本地  本地没远程下载）
- Never：只使用本地镜像,从不去远程仓库拉取,本地没有就报错 （一直使用本地）

> 默认值说明：
>
> ​    如果镜像tag为具体版本号, 默认策略是：IfNotPresent
>
> ​	如果镜像tag为：latest（最终版本） ,默认策略是always

```bash
# 创建pod
[root@master yaml]# kubectl create -f Pod-ImagePull.yaml
pod/pod-imagepull created

# 查看Pod详情
# 此时明显可以看到nginx镜像有一步Pulling image "nginx:1.17.1"的过程
[root@master yaml]# kubectl describe pod pod-imagepull -n default
......

Events:
  Type    Reason     Age              From               Message
  ----    ------     ----             ----               -------
  Normal  Scheduled  5s               default-scheduler  Successfully assigned default/pod-imagepull to work1.host.com
  Normal  Pulling    4s               kubelet            Pulling image "docker.io/library/nginx:1.23.1"
  Normal  Pulled     1s               kubelet            Successfully pulled image "docker.io/library/nginx:1.23.1" in 2.762104819s
  Normal  Created    1s               kubelet            Created container mynginx
  Normal  Started    1s               kubelet            Started container mynginx
  Normal  Pulled     1s (x2 over 1s)  kubelet            Container image "docker.io/library/busybox:1.35.0" already present on machine
  Normal  Created    1s (x2 over 1s)  kubelet            Created container mybusybox
  Normal  Started    1s               kubelet            Started container mybusybox
```

### 启动命令

在上面的配置中mybusybox容器一直没有成功运行,原因就是mybusybox容器不是一个程序,而是一个类似于一个工具类的合集，kubernetes集群启动后,会因为没有程序支撑运行而关闭容器。解决方法就是让他一直运行一个命令或者程。

创建Pod-Command.yaml文件,内容如下:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-command
  namespace: default
  labels:
    app: pod
spec:
  containers:
  - name: mynginx
    image: docker.io/library/nginx:1.23.1
  - name: mybusybox
    image: docker.io/library/busybox:1.35.0
    command: ["/bin/sh","-c","touch /tmp/hello.txt;while true;do /bin/echo $(date +%T) >> /tmp/hello.txt; sleep 3; done;"]
```

**command:**在pod中的容器初始化完成之后运行的命令。

> 命令解释：
>
> ​	`"/bin/sh","-c"` 使用sh来执行命令
>
> ​	`touch /tmp/hello.txt;` 在/tmp下创建一个hello.txt文件
>
> ​     `while true;do /bin/echo $(date +%T) >> /tmp/hello.txt; sleep 3; done;`每过三秒就往/tmp/hello.txt文件里面追加当前的时间

```bash
# 创建pod
[root@master yaml]# kubectl create -f Pod-Command.yaml
pod/pod-command created

# 查看Pod状态
# 这个时候俩容器就都正常运行了
[root@master yaml]# kubectl get pod
[root@master yaml]# kubectl get pod
NAME            READY   STATUS             RESTARTS         AGE
pod-command     2/2     Running            0                1m38s

# 进入容器查看文件内容
[root@master yaml]# kubectl exec pod-command -n default -it -c mybusybox /bin/sh
/ # tail -f /tmp/hello.txt
12:55:27
12:55:30
12:55:33
12:55:36
12:55:39
12:55:42
```

```
特别说明：
    通过上面发现command已经可以完成启动命令和传递参数的功能,为什么这里还要提供一个args选项,用于传递参数呢?这其实跟docker有点关系，kubernetes中的command、args两项其实是实现覆盖Dockerfile中ENTRYPOINT的功能。
 1 如果command和args均没有写,那么用Dockerfile的配置。
 2 如果command写了,但args没有写,那么Dockerfile默认的配置会被忽略,执行输入的command
 3 如果command没写,但args写了,那么Dockerfile中配置的ENTRYPOINT的命令会被执行,使用当前args的参数
 4 如果command和args都写了,那么Dockerfile的配置被忽略,执行command并追加上args参数
```



### 环境变量

创建Pod-Env.yaml文件,内容如下:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-env
  namespace: default
spec:
  containers:
  - name: mybusybox
    image: docker.io/library/busybox:1.35.0
    command: ["/bin/sh","-c","while true;do /bin/echo $(date +%T);sleep 60; done;"]
    env: # 设置环境变量列表
    - name: "username"
      value: "admin"
    - name: "password"
      value: "123456"
```

**env:** 环境变量,用于在pod中的容器设置环境变量。

```bash
# 创建pod
[root@master yaml]# kubectl create  -f Pod-Env.yaml
pod/pod-env created

# 进入容器,输出环境变量
[root@master yaml]# kubectl exec pod-env -n default -c mybusybox -it /bin/sh
/ # echo $username
admin
/ # echo $password
123456
```

这种方式不是很推荐,推荐将这些配置单独存储在配置文件中,这种方式将在后面介绍。

### 端口设置

要对容器的端口设置需要对containers的ports选项进行修改,先看一下ports支持的子选项

```bash
[root@master yaml]#  kubectl explain pod.spec.containers.ports
KIND:     Pod
VERSION:  v1

RESOURCE: ports <[]Object>

DESCRIPTION:
     List of ports to expose from the container. Exposing a port here gives the
     system additional information about the network connections a container
     uses, but is primarily informational. Not specifying a port here DOES NOT
     prevent that port from being exposed. Any port which is listening on the
     default "0.0.0.0" address inside a container will be accessible from the
     network. Cannot be updated.

     ContainerPort represents a network port in a single container.

FIELDS:
   containerPort        <integer> -required- 	# 容器要监听的端口(0<x<65536)
     Number of port to expose on the pod's IP address. This must be a valid port
     number, 0 < x < 65536.

   hostIP       <string>			# 要将外部端口绑定到的主机IP(一般省略)
     What host IP to bind the external port to.

   hostPort     <integer>			# 容器要在主机上公开的端口,如果设置,主机上只能运行容器的一个副本(一般省略) 
     Number of port to expose on the host. If specified, this must be a valid
     port number, 0 < x < 65536. If HostNetwork is specified, this must match
     ContainerPort. Most containers do not need this.

   name <string>				# 端口名称,如果指定,必须保证name在pod中是唯一的	
     If specified, this must be an IANA_SVC_NAME and unique within the pod. Each
     named port in a pod must have a unique name. Name for the port that can be
     referred to by services.

   protocol     <string>			# 端口协议。必须是UDP、TCP或SCTP。默认为“TCP”。
     Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
     Possible enum values:
     - `"SCTP"` is the SCTP protocol.
     - `"TCP"` is the TCP protocol.
     - `"UDP"` is the UDP protocol.
```

创建Pod-Ports.yaml，内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-ports
  namespace: default
spec:
  containers:
  - name: mynginx
    image:  docker.io/library/nginx:1.23.1
    ports: # 设置容器暴露的端口列表
    - name: nginx-port
      containerPort: 80
      protocol: TCP
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Ports.yaml
pod/pod-ports created

# 查看pod
# 在下面可以明显看到配置信息
[root@master ~]# [root@master yaml]# kubectl get pod pod-ports -n default -o yaml
......
spec:
  containers:
  - image: docker.io/library/nginx:1.23.1
    imagePullPolicy: IfNotPresent
    name: mynginx
    ports:
    - containerPort: 80
      name: nginx-port
      protocol: TCP
......
  podIP: 10.244.52.207
......

# 访问服务
# 访问容器中的程序需要使用的是`podIp:containerPort`
[root@master yaml]# curl http://10.244.52.207:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

### 资源配额

  容器中的程序要运行,肯定是要占用一定资源的,比如cpu和内存等,如果不对某个容器的资源做限制,那么它就可能吃掉大量资源,导致其它容器无法运行。针对这种情况，kubernetes提供了对内存和cpu的资源进行配额的机制,这种机制主要通过resources选项实现,他有两个子选项：

- limits：用于限制运行时容器的最大占用资源,当容器占用资源超过limits时会被终止,并进行重启

- requests ：用于设置容器需要的最小资源,如果环境资源不够,容器将无法启动

可以通过上面两个选项设置资源的上下限。

创建Pod-Resources.yaml，内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources
  namespace: default
spec:
  containers:
  - name: mynginx
    image: docker.io/library/nginx:1.23.1
    resources: # 资源配额
      limits:  # 限制资源（上限）
        cpu: "2" # CPU限制,单位是core数
        memory: "10Gi" # 内存限制
      requests: # 请求资源（下限）
        cpu: "1"  # CPU限制,单位是core数
        memory: "10Mi"  # 内存限制
```

CPU和Memory的单位说明：

- CPU: core数,可以为整数或小数

- Memory: 内存大小,可以使用Gi、Mi、G、M等形式

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Resources.yaml
pod/pod-resources created

# 查看发现pod运行状态
[root@master yaml]# kubectl get pod pod-resources -n default
NAME            READY   STATUS    RESTARTS   AGE
pod-resources   1/1     Running   0          88s

# 删除Pod
[root@master yaml]# kubectl delete -f Pod-Resources.yaml
pod "pod-resources" deleted

# 编辑Pod-Resources.yaml,修改requests的限制
......
requests: 
  cpu: "1"
  memory: "10Gi"
......

# 创建Pod
[root@master yaml]# kubectl create -f Pod-Resources.yaml
pod/pod-resources created

# 查看Pod状态,Pod启动失败
[root@master yaml]# kubectl get pod pod-resources -n default
NAME            READY   STATUS             RESTARTS         AGE
pod-resources   0/1     Pending            0                29s

# 查看Pod详细信息会看到报错
[root@master yaml]# kubectl describe pod pod-resources -n default
......
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  97s   default-scheduler  0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/master: }, 3 Insufficient memory. preemption: 0/3 nodes are available: 1 Preemption is not helpful for scheduling, 2 No preemption victims found for incoming pod.

# 上面的报错指三个节点内存不足
```

## Pod生命周期

### 生命周期过程

Pod生命周期一般是Pod对象从创建至终的这段时间范围称为pod的生命周期,它主要包含下面的过程：

- pod创建过程
- 运行初始化容器（init container）过程
- 运行主容器（main container）

  - 容器启动后钩子（post start）、容器终止前钩子（pre stop）

  - 容器的存活性探测（liveness probe）、就绪性探测（readiness probe）
- pod终止过程

![生命周期](https://image.boychai.xyz/article/Kubernetes_pod_2.png)

在整个生命周期中，Pod会出现5种**状态**（**相位**）,分别如下：

- 挂起（Pending）：apiserver已经创建了pod资源对象,但它尚未被调度完成或者仍处于下载镜像的过程中
- 运行中（Running）：pod已经被调度至某节点,并且所有容器都已经被kubelet创建完成
- 成功（Succeeded）：pod中的所有容器都已经成功终止并且不会被重启
- 失败（Failed）：所有容器都已经终止,但至少有一个容器终止失败,即容器返回了非0值的退出状态
- 未知（Unknown）：apiserver无法正常获取到pod对象的状态信息,通常由网络通信失败所导致

### 创建和终止

**pod的创建过程**

1. 用户通过kubectl或其他api客户端提交需要创建的pod信息给apiServer
2. apiServer开始生成pod对象的信息,并将信息存入etcd，然后返回确认信息至客户端
3. apiServer开始反映etcd中的pod对象的变化,其它组件使用watch机制来跟踪检查apiServer上的变动
4. scheduler发现有新的pod对象要创建,开始为Pod分配主机并将结果信息更新至apiServer
5. node节点上的kubelet发现有pod调度过来,尝试调用启动容器,并将结果回送至apiServer
6. apiServer将接收到的pod状态信息存入etcd中

![创建过程](https://image.boychai.xyz/article/Kubernetes_pod_3.png)

**pod的终止过程**

1. 用户向apiServer发送删除pod对象的命令
2. apiServcer中的pod对象信息会随着时间的推移而更新,在宽限期内（默认30s），pod被视为dead
3. 将pod标记为terminating状态
4. kubelet在监控到pod对象转为terminating状态的同时启动pod关闭过程
5. 端点控制器监控到pod对象的关闭行为时将其从所有匹配到此端点的service资源的端点列表中移除
6. 如果当前pod对象定义了preStop钩子处理器,则在其标记为terminating后即会以同步的方式启动执行
7. pod对象中的容器进程收到停止信号
8. 宽限期结束后,若pod中还存在仍在运行的进程,那么pod对象会收到立即终止的信号
9. kubelet请求apiServer将此pod资源的宽限期设置为0从而完成删除操作,此时pod对于用户已不可见

### 初始化容器

初始化容器是在pod的主容器启动之前要运行的容器,主要是做一些主容器的前置工作,它具有两大特征：

1. 初始化容器必须运行完成直至结束,若某初始化容器运行失败,那么kubernetes需要重启它直到成功完成
2. 初始化容器必须按照定义的顺序执行,当且仅当前一个成功之后,后面的一个才能运行

初始化容器有很多的应用场景,下面列出的是最常见的几个：

- 提供主容器镜像中不具备的工具程序或自定义代码
- 初始化容器要先于应用容器串行启动并运行完成,因此可用于延后应用容器的启动直至其依赖的条件得到满足

假设要以主容器运行一个web程序,但是要求在运行之前需要能够连接上mysql和redis所在的服务器,为了方便测试,事先规划好数据库服务器地址。创建文件Pod-InitContainer.yaml，内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-initcontainer
  namespace: default
spec:
  containers:
  - name: main-container
    image: docker.io/library/nginx:1.23.1
    ports: 
    - name: nginx-port
      containerPort: 80
  initContainers:
  - name: test-mysql
    image: docker.io/library/busybox:1.35.0
    command: ['sh', '-c', 'until ping 192.16.1.100 -c 1 ; do echo waiting for mysql...; sleep 2; done;']
  - name: test-redis
    image: docker.io/library/busybox:1.35.0
    command: ['sh', '-c', 'until ping 192.16.1.200 -c 1 ; do echo waiting for reids...; sleep 2; done;']
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-InitContainer.yaml
pod/pod-initcontainer created

# 查看状态
# 发现pod一直卡在第一个初始化容器过程中,后面的容器不会运行
[root@master yaml]# kubectl describe pod  pod-initcontainer -n default
......
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  66s   default-scheduler  Successfully assigned default/pod-initcontainer to work1.host.com
  Normal  Pulled     66s   kubelet            Container image "docker.io/library/busybox:1.35.0" already present on machine
  Normal  Created    66s   kubelet            Created container test-mysql
  Normal  Started    66s   kubelet            Started container test-mysql

# 动态查看pod状态
[root@master yaml]# kubectl get pods pod-initcontainer -n default -w
NAME                READY   STATUS     RESTARTS   AGE
pod-initcontainer   0/1     Init:0/2   0          5m1s
pod-initcontainer   0/1     Init:1/2   0          5m4s
pod-initcontainer   0/1     Init:1/2   0          5m5s
pod-initcontainer   0/1     PodInitializing   0          5m17s
pod-initcontainer   1/1     Running           0          5m18s

# 开一个新的终端链接并执行以下命令查看pod状态
[root@master ~]# ifconfig ens33:1 192.16.1.100 netmask 255.255.255.0 up
[root@master ~]# ifconfig ens33:1 192.16.1.200 netmask 255.255.255.0 up
```

### 钩子函数

钩子函数能够感知自身生命周期中的事件,并在相应的时刻到来时运行用户指定的程序代码。

kubernetes在主容器的启动之后和停止之前提供了两个钩子函数：

- post start：容器创建之后执行,如果失败了会重启容器
- pre stop  ：容器终止之前执行,执行完成之后容器将成功终止,在其完成之前会阻塞删除容器的操作

钩子处理器支持使用下面三种方式定义动作：

- Exec命令：在容器内执行一次命令

  ~~~yaml
  ……
    lifecycle:
      postStart: 
        exec:
          command:
          - cat
          - /tmp/healthy
  ……
  ~~~

- TCPSocket：在当前容器尝试访问指定的socket

  ~~~yaml
  ……      
    lifecycle:
      postStart:
        tcpSocket:
          port: 8080
  ……
  ~~~

- HTTPGet：在当前容器中向某url发起http请求

  ~~~yaml
  ……
    lifecycle:
      postStart:
        httpGet:
          path: / #URI地址
          port: 80 #端口号
          host: 192.168.109.100 #主机地址
          scheme: HTTP #支持的协议，http或者https
  ……
  ~~~

以exec方式为例,创建Pod-Hook-Exec.yaml文件,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-hook-exec
  namespace: default
spec:
  containers:
  - name: main-container
    image: docker.io/library/nginx:1.23.1
    ports:
    - name: nginx-port
      containerPort: 80
    lifecycle:
      postStart:
        exec: # 在容器启动的时候执行一个命令,修改掉nginx的默认首页内容
          command: ["/bin/sh", "-c", "echo postStart... > /usr/share/nginx/html/index.html"]
      preStop:
        exec: # 在容器停止之前停止nginx服务
          command: ["/usr/sbin/nginx","-s","quit"]
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Hook-Exec.yaml
pod/pod-hook-exec created

# 查看Pod
[root@master yaml]# kubectl get pods  pod-hook-exec -n default -o wide
NAME            READY   STATUS    RESTARTS   AGE   IP              NODE             NOMINATED NODE   READINESS GATES
pod-hook-exec   1/1     Running   0          52s   10.244.52.213   work2.host.com   <none>           <none>

# 访问Pod
[root@master yaml]# curl 10.244.52.213
postStart...
```

### 容器探测

容器探测用于检测容器中的应用实例是否正常工作,是保障业务可用性的一种传统机制。如果经过探测,实例的状态不符合预期,那么kubernetes就会把该问题实例" 摘除 ",不承担业务流量。kubernetes提供了两种探针来实现容器探测,分别是：

- liveness probes：存活性探针,用于检测应用实例当前是否处于正常运行状态,如果不是，k8s会重启容器

- readiness probes：就绪性探针,用于检测应用实例当前是否可以接收请求,如果不能，k8s不会转发流量

> livenessProbe 决定是否重启容器，readinessProbe 决定是否将请求转发给容器。

上面两种探针目前均支持三种探测方式：

- Exec命令：在容器内执行一次命令,如果命令执行的退出码为0，则认为程序正常,否则不正常

  ~~~yaml
  ……
    livenessProbe:
      exec:
        command:
        - cat
        - /tmp/healthy
  ……
  ~~~

- TCPSocket：将会尝试访问一个用户容器的端口,如果能够建立这条连接,则认为程序正常,否则不正常

  ~~~yaml
  ……      
    livenessProbe:
      tcpSocket:
        port: 8080
  ……
  ~~~

- HTTPGet：调用容器内Web应用的URL，如果返回的状态码在200和399之间,则认为程序正常,否则不正常

  ~~~yaml
  ……
    livenessProbe:
      httpGet:
        path: / #URI地址
        port: 80 #端口号
        host: 127.0.0.1 #主机地址
        scheme: HTTP #支持的协议，http或者https
  ……
  ~~~

以liveness probes为例,做几个演示:

**方式一：Exec**

创建Pod-Liveness-Exec.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-exec
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
    ports: 
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      exec:
        command: ["/bin/cat","/tmp/hello.txt"] # 执行一个查看文件的命令
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Liveness-Exec.yaml
pod/pod-liveness-exec created

# 查看Pod详情
# 发现nginx容器启动之后就进行了健康检查
# 检查失败之后容器就呗kill掉了,之后容器
[root@master yaml]# kubectl describe pods pod-liveness-exec -n default
......
Events:
  Type     Reason     Age               From               Message
  ----     ------     ----              ----               -------
  Normal   Scheduled  25s               default-scheduler  Successfully assigned default/pod-liveness-exec to work1.host.com
  Normal   Pulled     24s               kubelet            Container image "docker.io/library/nginx:1.23.1" already present on machine
  Normal   Created    24s               kubelet            Created container nginx
  Normal   Started    24s               kubelet            Started container nginx
  Warning  Unhealthy  5s (x2 over 15s)  kubelet            Liveness probe failed: /bin/cat: /tmp/hello.txt: No such file or directory

# 查看Pod状态
# 发现RESTARTS一直在增长
[root@master yaml]# kubectl get pods pod-liveness-exec -n default
NAME                READY   STATUS             RESTARTS      AGE
pod-liveness-exec   0/1     CrashLoopBackOff   4 (12s ago)   2m43s
```

**方式二：TCPSocket**

创建Pod-Liveness-Tcpsocket.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-tcpsocket
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      tcpSocket:
        port: 8080 # 尝试访问8080端口
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f  Pod-Liveness-Tcpsocket.yaml
pod/pod-liveness-tcpsocket created

# 查看Pod详情
# 发现容器尝试访问8080端口,但是失败了
[root@master yaml]# kubectl describe pods pod-liveness-tcpsocket -n default
......
Events:
  Type     Reason     Age               From               Message
  ----     ------     ----              ----               -------
  Normal   Scheduled  31s               default-scheduler  Successfully assigned default/pod-liveness-tcpsocket to work1.host.com
  Normal   Pulled     1s (x2 over 30s)  kubelet            Container image "docker.io/library/nginx:1.23.1" already present on machine
  Normal   Created    1s (x2 over 30s)  kubelet            Created container nginx
  Normal   Started    1s (x2 over 30s)  kubelet            Started container nginx
  Warning  Unhealthy  1s (x3 over 21s)  kubelet            Liveness probe failed: dial tcp 10.244.67.89:8080: connect: connection refused
  Normal   Killing    1s                kubelet            Container nginx failed liveness probe, will be restarted

# 查看Pod状态
# 发现RESTARTS一直在增长
[root@master yaml]# kubectl get pods pod-liveness-tcpsocket -n default
NAME                     READY   STATUS    RESTARTS     AGE
pod-liveness-tcpsocket   1/1     Running   4 (7s ago)   2m7s
```

**方式三：HTTPGet**

创建Pod-Liveness-Httpget.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-httpget
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      httpGet:          # 其实就是访问http://127.0.0.1:80/hello
        scheme: HTTP    #支持的协议，http或者https
        port: 80        #端口号
        path: /hello    #URI地址
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Liveness-Httpget.yaml
pod/pod-liveness-httpget created

# 查看Pod详情
[root@master yaml]# kubectl describe pod pod-liveness-httpget -n default
......
Events:
  Type     Reason     Age               From               Message
  ----     ------     ----              ----               -------
  Normal   Scheduled  22s               default-scheduler  Successfully assigned default/pod-liveness-httpget to work2.host.com
  Normal   Pulled     22s               kubelet            Container image "docker.io/library/nginx:1.23.1" already present on machine
  Normal   Created    21s               kubelet            Created container nginx
  Normal   Started    21s               kubelet            Started container nginx
  Warning  Unhealthy  2s (x2 over 12s)  kubelet            Liveness probe failed: HTTP probe failed with statuscode: 404

# 查看Pod状态
# 发现RESTARTS一直在增长
[root@master yaml]# kubectl get pod pod-liveness-httpget -n default
NAME                   READY   STATUS    RESTARTS      AGE
pod-liveness-httpget   1/1     Running   2 (26s ago)   86s
```

在LivenessProbe的子属性下还会发现一些其他的配置,这里简单解释一下含义：

```bash
[root@master yaml]# kubectl explain pod.spec.containers.livenessProbe
KIND:     Pod
VERSION:  v1

RESOURCE: livenessProbe <Object>

DESCRIPTION:
     Periodic probe of container liveness. Container will be restarted if the
     probe fails. Cannot be updated. More info:
     https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

     Probe describes a health check to be performed against a container to
     determine whether it is alive or ready to receive traffic.

FIELDS:
   exec <Object>
     Exec specifies the action to take.

   failureThreshold     <integer>		# 连续探测失败多少次才被认定为失败。默认是3。最小值是1
     Minimum consecutive failures for the probe to be considered failed after
     having succeeded. Defaults to 3. Minimum value is 1.

   grpc <Object>
     GRPC specifies an action involving a GRPC port. This is a beta field and
     requires enabling GRPCContainerProbe feature gate.

   httpGet      <Object>
     HTTPGet specifies the http request to perform.

   initialDelaySeconds  <integer>		# 容器启动后等待多少秒执行第一次探测 
     Number of seconds after the container has started before liveness probes
     are initiated. More info:
     https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

   periodSeconds        <integer>		# 执行探测的频率。默认是10秒,最小1秒
     How often (in seconds) to perform the probe. Default to 10 seconds. Minimum
     value is 1.

   successThreshold     <integer>		# 连续探测成功多少次才被认定为成功。默认是1
     Minimum consecutive successes for the probe to be considered successful
     after having failed. Defaults to 1. Must be 1 for liveness and startup.
     Minimum value is 1.

   tcpSocket    <Object>
     TCPSocket specifies an action involving a TCP port.

   terminationGracePeriodSeconds        <integer>
     Optional duration in seconds the pod needs to terminate gracefully upon
     probe failure. The grace period is the duration in seconds after the
     processes running in the pod are sent a termination signal and the time
     when the processes are forcibly halted with a kill signal. Set this value
     longer than the expected cleanup time for your process. If this value is
     nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this
     value overrides the value provided by the pod spec. Value must be
     non-negative integer. The value zero indicates stop immediately via the
     kill signal (no opportunity to shut down). This is a beta field and
     requires enabling ProbeTerminationGracePeriod feature gate. Minimum value
     is 1. spec.terminationGracePeriodSeconds is used if unset.

   timeoutSeconds       <integer>		# 探测超时时间。默认1秒,最小1秒
     Number of seconds after which the probe times out. Defaults to 1 second.
     Minimum value is 1. More info:
     https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

```

设置探测详细时间参照下面配置

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-httpget
  namespace: dev
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      httpGet:
        scheme: HTTP
        port: 80 
        path: /
      initialDelaySeconds: 30 # 容器启动后30s开始探测
      timeoutSeconds: 5 # 探测超时时间为5s
```



### 重启策略

在容器探测livenessProbe中一旦探测出现了问题,Kubernetes就会对容器所在的Pod进行重启,重启的方式是由pod的重启策略决定的，Pod的重启策略有三种,分别如下:

- Always ：容器失效时,自动重启该容器,这也是默认值。
- OnFailure ： 容器终止运行且退出码不为0时重启
- Never ： 不论状态为何,都不重启该容器

重启策略适用于pod对象中的所有容器,首次需要重启的容器,将在其需要时立即进行重启,随后再次需要重启的操作将由kubelet延迟一段时间后进行,且反复的重启操作的延迟时长以此为10s、20s、40s、80s、160s和300s，300s是最大延迟时长。

创建Pod-Restartpolicy.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-restartpolicy
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      httpGet:
        scheme: HTTP
        port: 80
        path: /hello
  restartPolicy: Never # 设置重启策略为Never
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Restartpolicy.yaml
pod/pod-restartpolicy created

# 查看Pod详情,发现nginx容器的健康检查失败
[root@master yaml]# kubectl  describe pods pod-restartpolicy  -n default
......
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  49s                default-scheduler  Successfully assigned default/pod-restartpolicy to work1.host.com
  Normal   Pulled     48s                kubelet            Container image "docker.io/library/nginx:1.23.1" already present on machine
  Normal   Created    48s                kubelet            Created container nginx
  Normal   Started    48s                kubelet            Started container nginx
  Warning  Unhealthy  19s (x3 over 39s)  kubelet            Liveness probe failed: HTTP probe failed with statuscode: 404
  Normal   Killing    19s                kubelet            Stopping container nginx

# 过一会之后,查看pod的状态,发现重启次数一直是0
[root@master yaml]# kubectl  get pods pod-restartpolicy -n default
NAME                READY   STATUS      RESTARTS   AGE
pod-restartpolicy   0/1     Completed   0          2m7s
```



## Pod调度

### 调度方式

在默认情况下，一个Pod在哪个Node节点上运行，是由Scheduler组件采用相应的算法计算出来的，这个过程是不受人工控制的。但是在实际使用中，这并不满足的需求，因为很多情况下，控制某些Pod到达某些节点上，这就需要了解kubernetes对Pod的调度规则，kubernetes提供了四大类调度方式：

- 自动调度：运行在哪个节点上完全由Scheduler经过一系列的算法计算得出
- 定向调度：NodeName、NodeSelector
- 亲和性调度：NodeAffinity、PodAffinity、PodAntiAffinity
- 污点（容忍）调度：Taints、Toleration

### 定向调度

定向调度，指的是利用在pod上声明nodeName或者nodeSelector，以此将Pod调度到期望的node节点上。注意，这里的调度是强制的，这就意味着即使要调度的目标Node不存在，也会向上面进行调度，只不过pod运行失败而已

#### NodeName

NodeName用于强制约束将Pod调度到指定的Name的Node节点上。这种方式，其实是直接跳过Scheduler的调度逻辑，直接将Pod调度到指定名称的节点。

创建一个Pod-Nodename.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodename
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  nodeName: node1  # 指定调度到node1节点上
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Nodename.yaml
pod/pod-nodename created

# 查看Pod具体状态和调度节点
# 发现Pod调度到了node1节点上，但是实则我的集群是没有这个节点的所以导致一直无法正常运行
[root@master yaml]# kubectl get pods pod-nodename -n default -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP       NODE    NOMINATED NODE   READINESS GATES
pod-nodename   0/1     Pending   0          10s   <none>   node1   <none>           <none>

# 修改文件的nodeName为"work1.host.com"并更新配置
[root@master yaml]# vim Pod-Nodename.yaml
[root@master yaml]# kubectl apply -f Pod-Nodename.yaml
pod/pod-nodename created

# 再次查看Pod的具体状态和调度节点
# 发现已经成功调度到其他节点并运行成功
[root@master yaml]# kubectl get pods pod-nodename -n default -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP             NODE             NOMINATED NODE   READINESS GATES
pod-nodename   1/1     Running   0          34s   10.244.67.91   work1.host.com   <none>           <none>
```

#### NodeSelector

NodeSelector用于将pod调度到添加了指定标签的node节点上。它是通过kubernetes的label-selector机制实现的，也就是说，在pod创建之前，会由scheduler使用MatchNodeSelector调度策略进行label匹配，找出目标node，然后将pod调度到目标节点，该匹配规则是强制约束。

```bash
# 给节点创建标签
# 给work1.host.com节点创建了一个nodeenv=pro标签
# 给work2.host.com节点创建了一个nodeenv=test标签
[root@master yaml]# kubectl label nodes work1.host.com nodeenv=pro
node/work1.host.com labeled
[root@master yaml]# kubectl label nodes work2.host.com nodeenv=test
node/work2.host.com labeled
```

创建Pod-Nodeselector.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeselector
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  nodeSelector: 
    nodeenv: pro # 指定调度到具有nodeenv=pro标签的节点上
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Nodeselector.yaml
pod/pod-nodeselector created

# 查看Pod的具体状态和调度节点
[root@master yaml]# kubectl get pods pod-nodeselector -n default -o wide
NAME               READY   STATUS    RESTARTS   AGE   IP             NODE             NOMINATED NODE   READINESS GATES
pod-nodeselector   1/1     Running   0          51s   10.244.67.92   work1.host.com   <none>           <none>

# 之后删除pod，修改nodeSelector的值为nodeenv: pro2 (不存在打有此标签的节点)
[root@master yaml]# kubectl delete -f Pod-Nodeselector.yaml
pod "pod-nodeselector" deleted
[root@master yaml]# vim Pod-Nodeselector.yaml
[root@master yaml]# kubectl create -f Pod-Nodeselector.yaml
pod/pod-nodeselector created

# 再次查看Pod的具体状态和调度节点
# 发现调度节的值为<none>
[root@master yaml]# kubectl get pods pod-nodeselector -n default -o wide
NAME               READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
pod-nodeselector   0/1     Pending   0          43s   <none>   <none>   <none>           <none>

# 通过查看Pod详情，发现node selector匹配失败的提示
[root@master yaml]# kubectl describe pods pod-nodeselector -n default
......
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  118s  default-scheduler  0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/master: }, 3 node(s) didn't match Pod's node affinity/selector. preemption: 0/3 nodes are available: 3 Preemption is not helpful for scheduling.
```



### 亲和性调度

使用定向调度进行调度时，如果出现没有满足条件的Node那么Pod就会不被运行,为了解决这个问题,Kubernetes在NodeSelector的基础之上的进行了扩展，通过配置的形式实现优先选择满足条件的Node进行调度，如果没有也可以调度到不满足条件的节点上，使其更加灵活。Affinity主要分为三类：

- nodeAffinity(node亲和性）: 以node为目标，解决pod可以调度到哪些node的问题

- podAffinity(pod亲和性) :  以pod为目标，解决pod可以和哪些已存在的pod部署在同一个拓扑域中的问题

- podAntiAffinity(pod反亲和性) :  以pod为目标，解决pod不能和哪些已存在pod部署在同一个拓扑域中的问题

> 关于亲和性(反亲和性)使用场景的说明：
>
> **亲和性**：如果两个应用频繁交互，那就有必要利用亲和性让两个应用的尽可能的靠近，这样可以减少因网络通信而带来的性能损耗。
>
> **反亲和性**：当应用的采用多副本部署时，有必要采用反亲和性让各个应用实例打散分布在各个node上，这样可以提高服务的高可用性。

#### NodeAffinity

`NodeAffinity`的可配置项如下：

```yaml
pod.spec.affinity.nodeAffinity
  requiredDuringSchedulingIgnoredDuringExecution  Node节点必须满足指定的所有规则才可以，相当于硬限制
    nodeSelectorTerms  节点选择列表
      matchFields   按节点字段列出的节点选择器要求列表
      matchExpressions   按节点标签列出的节点选择器要求列表(推荐)
        key    键
        values 值
        operator 关系符 支持Exists, DoesNotExist, In, NotIn, Gt, Lt
  preferredDuringSchedulingIgnoredDuringExecution 优先调度到满足指定的规则的Node，相当于软限制 (倾向)
    preference   一个节点选择器项，与相应的权重相关联
      matchFields   按节点字段列出的节点选择器要求列表
      matchExpressions   按节点标签列出的节点选择器要求列表(推荐)
        key    键
        values 值
        operator 关系符 支持In, NotIn, Exists, DoesNotExist, Gt, Lt
	weight 倾向权重，在范围1-100。
```

```yaml
关系符的使用说明:

- matchExpressions:
  - key: nodeenv              # 匹配存在标签的key为nodeenv的节点
    operator: Exists
  - key: nodeenv              # 匹配标签的key为nodeenv,且value是"xxx"或"yyy"的节点
    operator: In
    values: ["xxx","yyy"]
  - key: nodeenv              # 匹配标签的key为nodeenv,且value大于"xxx"的节点
    operator: Gt
    values: "xxx"
```

**requiredDuringSchedulingIgnoredDuringExecution**

创建Pod-Nodeaffinity-Required.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-required
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  affinity:  #亲和性设置
    nodeAffinity: #设置node亲和性
      requiredDuringSchedulingIgnoredDuringExecution: # 硬限制
        nodeSelectorTerms:
        - matchExpressions: # 匹配env的值在["xxx","yyy"]中的标签
          - key: nodeenv
            operator: In
            values: ["xxx","yyy"]
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Nodeaffinity-Required.yaml
pod/pod-nodeaffinity-required created

# 查看Pod状态
# 发现Pod的NODE一直为<none>
[root@master yaml]# kubectl get pods pod-nodeaffinity-required -n default -o wide
NAME                        READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
pod-nodeaffinity-required   0/1     Pending   0          21s   <none>   <none>   <none>           <none>

# 查看Pod详情
# 发现提示node选择失败
[root@master yaml]# kubectl describe pod pod-nodeaffinity-required -n default
......
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  105s  default-scheduler  0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/master: }, 3 node(s) didn't match Pod's node affinity/selector. preemption: 0/3 nodes are available: 3 Preemption is not helpful for scheduling.
  
# 删除Pod
[root@master yaml]# kubectl delete -f Pod-Nodeaffinity-Required.yaml
pod "pod-nodeaffinity-required" deleted

# 修改Pod-Nodeaffinity-Required.yaml文件
# 将values: ["xxx","yyy"]------> ["pro","yyy"],并启动
[root@master yaml]# vim Pod-Nodeaffinity-Required.yaml
[root@master yaml]# kubectl create -f Pod-Nodeaffinity-Required.yaml
pod/pod-nodeaffinity-required created

# 查看Pod信息
# 发现Pod已经成功调度到work1.host.com节点上
[root@master yaml]#  kubectl get pods pod-nodeaffinity-required -n default -o wide
NAME                        READY   STATUS    RESTARTS   AGE   IP              NODE             NOMINATED NODE   READINESS GATES
pod-nodeaffinity-required   1/1     Running   0          79s   10.244.67.107   work1.host.com   <none>           <none>
```

**requiredDuringSchedulingIgnoredDuringExecution**

创建Pod-Nodeaffinity-Preferred.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-preferred
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  affinity:  #亲和性设置
    nodeAffinity: #设置node亲和性
      preferredDuringSchedulingIgnoredDuringExecution: # 软限制
      - weight: 1
        preference:
          matchExpressions: # 匹配env的值在["xxx","yyy"]中的标签(当前环境没有)
          - key: nodeenv
            operator: In
            values: ["xxx","yyy"]
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Nodeaffinity-Preferred.yaml
pod/pod-nodeaffinity-preferred created

# 查看Pod状态
# 发现Pod成功调度
[root@master yaml]# kubectl get pod pod-nodeaffinity-preferred -n default
NAME                         READY   STATUS    RESTARTS   AGE
pod-nodeaffinity-preferred   1/1     Running   0          27s
```

```markdown
NodeAffinity规则设置的注意事项：
    1 如果同时定义了nodeSelector和nodeAffinity，那么必须两个条件都得到满足，Pod才能运行在指定的Node上
    2 如果nodeAffinity指定了多个nodeSelectorTerms，那么只需要其中一个能够匹配成功即可
    3 如果一个nodeSelectorTerms中有多个matchExpressions ，则一个节点必须满足所有的才能匹配成功
    4 如果一个pod所在的Node在Pod运行期间其标签发生了改变，不再符合该Pod的节点亲和性需求，则系统将忽略此变化
```

#### PodAffinity

PodAffinity主要实现以运行的Pod为参照，实现让新创建的Pod跟参照pod在一个区域的功能。`PodAffinity`的可配置项如下

```yaml
pod.spec.affinity.podAffinity
  requiredDuringSchedulingIgnoredDuringExecution  硬限制
    namespaces       指定参照pod的namespace
    topologyKey      指定调度作用域
    labelSelector    标签选择器
      matchExpressions  按节点标签列出的节点选择器要求列表(推荐)
        key    键
        values 值
        operator 关系符 支持In, NotIn, Exists, DoesNotExist.
      matchLabels    指多个matchExpressions映射的内容
  preferredDuringSchedulingIgnoredDuringExecution 软限制
    podAffinityTerm  选项
      namespaces      
      topologyKey
      labelSelector
        matchExpressions  
          key    键
          values 值
          operator
        matchLabels 
    weight 倾向权重，在范围1-100
```

```markdown
topologyKey用于指定调度时作用域,例如:
    如果指定为kubernetes.io/hostname，那就是以Node节点为区分范围
	如果指定为beta.kubernetes.io/os,则以Node节点的操作系统类型来区分
```

**requiredDuringSchedulingIgnoredDuringExecution**

创建一个参照Pod的清单Pod-Podaffinity-Target.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podaffinity-target
  namespace: default
  labels:
    podenv: pro #设置标签
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  nodeName: work1.host.com # 将目标pod名确指定到work1.host.com上
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Podaffinity-Target.yaml
pod/pod-podaffinity-target created

# 查看Pod状态和调度节点
[root@master yaml]# kubectl get pods  pod-podaffinity-target -n default -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP              NODE             NOMINATED NODE   READINESS GATES
pod-podaffinity-target   1/1     Running   0          19m   10.244.67.108   work1.host.com   <none>           <none>
```

创建Pod-Podaffinity-Required.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podaffinity-required
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  affinity:  #亲和性设置
    podAffinity: #设置pod亲和性
      requiredDuringSchedulingIgnoredDuringExecution: # 硬限制
      - labelSelector:
          matchExpressions: # 匹配env的值在["xxx","yyy"]中的标签
          - key: podenv
            operator: In
            values: ["xxx","yyy"]
        topologyKey: kubernetes.io/hostname
```

上面的配置为匹配标签podenv=xxx或者podenv=yyy的容器的同一节点，现在还没有这样的Pod，下面运行测试一下

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Podaffinity-Required.yaml
pod/pod-podaffinity-required created

# 查看Pod状态
# 发现创建失败
[root@master yaml]# kubectl get pods pod-podaffinity-required -n default
NAME                       READY   STATUS    RESTARTS   AGE
pod-podaffinity-required   0/1     Pending   0          41s

# 查看Pod详情
# 发现NODE节点调度失败
[root@master yaml]# kubectl describe pods pod-podaffinity-required  -n default
......
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  85s   default-scheduler  0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/master: }, 3 node(s) didn't match pod affinity rules. preemption: 0/3 nodes are available: 3 Preemption is not helpful for scheduling.
  
# 删除Pod
[root@master yaml]# kubectl delete -f Pod-Podaffinity-Required.yaml
pod "pod-podaffinity-required" deleted

# 修改Pod-Podaffinity-Required.yaml的values: ["xxx","yyy"]为values:["pro","yyy"]
# 再次创建Pod
[root@master yaml]# vim Pod-Podaffinity-Required.yaml
[root@master yaml]# kubectl create -f Pod-Podaffinity-Required.yaml
pod/pod-podaffinity-required created

# 再次查看Pod状态
# 发现Pod已经成调度到参照Pod的节点
[root@master yaml]# kubectl get pods pod-podaffinity-required -n default -o wide
NAME                       READY   STATUS    RESTARTS   AGE   IP              NODE             NOMINATED NODE   READINESS GATES
pod-podaffinity-required   1/1     Running   0          61s   10.244.67.109   work1.host.com   <none>           <none>
```

`PodAffinity`的 `preferredDuringSchedulingIgnoredDuringExecution`，不再演示。

#### PodAntiAffinity

PodAntiAffinity主要实现以运行的Pod为参照，让新创建的Pod跟参照pod不在一个区域中的功能。PodAntiAffinty的配置方式适合PodAffinty是一样的，测试方法如下

```bash
# 继续使用PodAffinity的Pod为参照Pod
[root@master yaml]# kubectl get pods -n default -o wide --show-labels
NAME                         READY   STATUS             RESTARTS          AGE     IP              NODE             NOMINATED NODE   READINESS GATES   LABELS
pod-podaffinity-target       1/1     Running            0                 28m     10.244.67.108   work1.host.com   <none>           <none>            podenv=pro
```

创建Pod-Podantiaffinity-Required.yaml，内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podantiaffinity-required
  namespace: default
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
  affinity:  #亲和性设置
    podAntiAffinity: #设置pod亲和性
      requiredDuringSchedulingIgnoredDuringExecution: # 硬限制
      - labelSelector:
          matchExpressions: # 匹配podenv的值在["pro"]中的标签
          - key: podenv
            operator: In
            values: ["pro"]
        topologyKey: kubernetes.io/hostname
```

上面配置为新Pod必须要与拥有标签nodeenv=pro的pod不在同一Node上，运行测试一下

```bash
# 创建Pod
[root@master yaml]# kubectl create -f Pod-Podantiaffinity-Required.yaml
pod/pod-podantiaffinity-required created

# 查看Pod状态
# 发现Pod调度到了work2.host.com节点
[root@master yaml]# kubectl get pods pod-podantiaffinity-required -n default -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP              NODE             NOMINATED NODE   READINESS GATES
pod-podantiaffinity-required   1/1     Running   0          2m13s   10.244.52.230   work2.host.com   <none>           <none>
```

### 污点和容忍

#### 污点（Taints）

前面的调度方式都是站在Pod的角度上，通过在Pod上添加属性，来确定Pod是否要调度到指定的Node上，其实我们也可以站在Node的角度上，通过在Node上添加**污点**属性，来决定是否允许Pod调度过来。Node被设置上污点之后就和Pod之间存在了一种相斥的关系，进而拒绝Pod调度进来，甚至可以将已经存在的Pod驱逐出去。

污点的格式为：`key=value:effect`, key和value是污点的标签，effect描述污点的作用，支持如下三个选项：

- PreferNoSchedule：kubernetes将尽量避免把Pod调度到具有该污点的Node上，除非没有其他节点可调度
- NoSchedule：kubernetes将不会把Pod调度到具有该污点的Node上，但不会影响当前Node上已存在的Pod
- NoExecute：kubernetes将不会把Pod调度到具有该污点的Node上，同时也会将Node上已存在的Pod驱离

![Taints](https://image.boychai.xyz/article/Kubernetes_pod_4.png)

```bash
# 设置污点
kubectl taint nodes <节点> key=value:effect

# 去除污点
kubectl taint nodes <节点> key:effect-

# 去除所有污点
kubectl taint nodes <节点> key-

# 查看污点
kubectl describe node <节点>
......
Taints:             <none>
......
```

已**NoSchedule**为例，创建Pod-Taints-Noschedule.yaml,内容如下

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-taints-noschedule
  namespace: default
  labels:
    app: pod
spec:
  containers:
  - name: nginx
    image: docker.io/library/nginx:1.23.1
```



```bash
# 为work1.host.com创建污点
[root@master yaml]# kubectl taint nodes work1.host.com region=qingdao:NoSchedule
node/work1.host.com tainted

# 为work2.host.com创建污点
[root@master yaml]# kubectl taint nodes work2.host.com region=beijing:NoSchedule
node/work2.host.com tainted

# 创建Pod
[root@master yaml]# kubectl create -f Pod-Taints-Noschedule.yaml
pod/pod-taints-noschedule created

# 查看Pod状态
# 发现Pod未被调度到节点上面
[root@master yaml]# kubectl get pod -n default pod-taints-noschedule -o wide
NAME                    READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
pod-taints-noschedule   0/1     Pending   0          38s   <none>   <none>   <none>           <none>

# 查看Pod详情
# 发现集群3台NODE都有污点不能调度
[root@master yaml]# kubectl describe pod -n default pod-taints-noschedule
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  108s  default-scheduler  0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/master: }, 1 node(s) had untolerated taint {region: beijing}, 1 node(s) had untolerated taint {region: qingdao}. preemption: 0/3 nodes are available: 3 Preemption is not helpful for scheduling.
```



#### 容忍（Toleration）

污点就是拒绝，容忍就是忽略，Node通过污点拒绝pod调度上去，Pod通过容忍忽略拒绝。

![Taints](https://image.boychai.xyz/article/Kubernetes_pod_5.png)

配置模板

```bash
[root@master yaml]# kubectl explain pod.spec.tolerations
......
FIELDS:
   key       # 对应着要容忍的污点的键，空意味着匹配所有的键
   value     # 对应着要容忍的污点的值
   operator  # key-value的运算符，支持Equal和Exists（默认）
   effect    # 对应污点的effect，空意味着匹配所有影响
   tolerationSeconds   # 容忍时间, 当effect为NoExecute时生效，表示pod在Node上的停留时间
```

创建Pod-Toleration.yaml,内容如下

```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: pod-toleration
      namespace: default
      labels:
        app: pod
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
      tolerations:      		# 添加容忍
      - key: "region"        	# 要容忍的污点的key
        operator: "Equal"  	# 操作符equal等于
        value: "beijing"   	# 容忍的污点的value
        effect: "NoSchedule"  # 添加容忍的规则，这里必须和标记的污点规则相同
```

```bash
# 创建Pod
[root@master yaml]# kubectl create -f  Pod-Toleration.yaml
pod/pod-toleration created

# 查看Pod状态
# 发现成功调度到work2.host.com节点
[root@master yaml]# kubectl get pod pod-toleration -n default -o wide
NAME             READY   STATUS    RESTARTS   AGE   IP              NODE             NOMINATED NODE   READINESS GATES
pod-toleration   1/1     Running   0          6s    10.244.52.232   work2.host.com   <none>           <none>
```

