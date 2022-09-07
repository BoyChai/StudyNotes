# Pod控制器概述

## 引入

Pod是kubernetes的最小管理单元，在kubernetes中，按照pod的创建方式可以将其分为两类：

- 自主式pod：kubernetes直接创建出来的Pod，这种pod删除后就没有了，也不会重建
- 控制器创建的pod：kubernetes通过控制器创建的pod，这种pod删除了之后还会自动重建       

## 控制器

Pod控制器是管理pod的中间层，使用Pod控制器之后，只需要告诉Pod控制器，想要多少个什么样的Pod就可以了，它会创建出满足条件的Pod并确保每一个Pod资源处于用户期望的目标状态。如果Pod资源在运行中出现故障，它会基于指定策略重新编排Pod。

## 类别

在kubernetes中，有很多类型的pod控制器，每种都有自己的适合的场景，常见的有下面这些：

- ReplicationController：比较原始的pod控制器，已经被废弃，由ReplicaSet替代

- ReplicaSet：保证副本数量一直维持在期望值，并支持pod数量扩缩容，镜像版本升级

- Deployment：通过控制ReplicaSet来控制Pod，并支持滚动升级、回退版本

- Horizontal Pod Autoscaler：可以根据集群负载自动水平调整Pod的数量，实现削峰填谷

- DaemonSet：在集群中的指定Node上运行且仅运行一个副本，一般用于守护进程类的任务

- Job：它创建出来的pod只要完成任务就立即退出，不需要重启或重建，用于执行一次性任务

- Cronjob：它创建的Pod负责周期性任务控制，不需要持续后台运行

- StatefulSet：管理有状态应用

# ReplicaSet(RS)

## 概述

ReplicaSet的主要作用是**保证一定数量的pod正常运行**，它会持续监听这些Pod的运行状态，一旦Pod发生故障，就会重启或重建。同时它还支持对pod数量的扩缩容和镜像版本的升降级。

## 资源清单

```yaml
apiVersion: apps/v1 # 版本号
kind: ReplicaSet # 类型       
metadata: 
  name: 
  namespace:
  labels:
spec:
  replicas: <副本数量>
  selector: # 选择器，通过它指定该控制器管理哪些pod
    matchLabels:      # Labels匹配规则
    matchExpressions: # Expressions匹配规则
      - {key: <lableskey>, operator: <匹配方式>, values: <lablesvalue>}
  template: # 模板，当副本数量不足时，会根据下面的模板创建pod副本
    metadata:
      labels:
    spec:
      containers:
      - name:
        image:
        ports:
```

**replicas：**指定副本数量，其实就是当前rs创建出来的pod的数量，默认为1

**selector：**选择器，它的作用是建立pod控制器和pod之间的关联关系，采用的Label Selector机制。在pod模板上定义label，在控制器上定义选择器，就可以表明当前控制器能管理哪些pod了

**template：**模板，就是当前控制器创建pod所使用的模板板，里面其实就是前一章学过的pod的定义

## 创建RS

创建Pc-Replicaset.yaml文件，内容如下：

~~~yaml
apiVersion: apps/v1
kind: ReplicaSet   
metadata:
  name: pc-replicaset
  namespace: default
spec:
  replicas: 3
  selector: 
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
~~~

```bash
# 创建rs
[root@master yaml]# kubectl create -f Pc-Replicaset.yaml
replicaset.apps/pc-replicaset created

# 查看rs
# DESIRED:期望副本数量  
# CURRENT:当前副本数量  
# READY:已经准备好提供服务的副本数量
[root@master yaml]# kubectl get rs pc-replicaset -n default -o wide
NAME            DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES                           SELECTOR
pc-replicaset   3         3         3       2m41s   nginx        docker.io/library/nginx:1.23.1   app=nginx-pod

# 查看当前控制器创建出来的pod
# 控制器创建的pod的名称是在控制器名称后面拼接了-xxxxx随机码
[root@master yaml]# kubectl get pod -n default
NAME                           READY   STATUS             RESTARTS          AGE
pc-replicaset-fvjg2            1/1     Running            0                 3m53s
pc-replicaset-lzfc2            1/1     Running            0                 3m53s
pc-replicaset-q7hrm            1/1     Running            0                 3m53s
```

## 扩缩容

```bash
# 在线编辑配置
# 修改spce.replicas为6即可
[root@master yaml]# kubectl edit rs pc-replicaset -n default
replicaset.apps/pc-replicaset edited

# 查看Pod数量
[root@master yaml]# kubectl get pod -n default
NAME                           READY   STATUS             RESTARTS          AGE
pc-replicaset-49zl6            1/1     Running            0                 67s
pc-replicaset-5ngpl            1/1     Running            0                 67s
pc-replicaset-fvjg2            1/1     Running            0                 6m45s
pc-replicaset-lzfc2            1/1     Running            0                 6m45s
pc-replicaset-pnstd            1/1     Running            0                 67s
pc-replicaset-q7hrm            1/1     Running            0                 6m45s

# 使用命令
# 使用scale实现扩缩容replicas为扩缩容的数量
[root@master yaml]# kubectl scale rs pc-replicaset --replicas=2 -n default
replicaset.apps/pc-replicaset scaled

# 查看Pod数量
[root@master yaml]# kubectl get pod -n default|grep pc
NAME                           READY   STATUS             RESTARTS          AGE
pc-replicaset-fvjg2            1/1     Running            0                 8m39s
pc-replicaset-q7hrm            1/1     Running            0                 8m39s
```

## 镜像升级

```bash
# 在线编辑配置
# 修改spce.template.spec.containers.image为docker.io/library/nginx:latest即可
[root@master yaml]# kubectl edit rs pc-replicaset -n default
replicaset.apps/pc-replicaset edited

# 查看rs状态
# 镜像版本已经变更了
[root@master yaml]# kubectl get rs -n default -o wide
NAME            DESIRED   CURRENT   READY   AGE   CONTAINERS   IMAGES                           SELECTOR
pc-replicaset   2         2         2       14m   nginx        docker.io/library/nginx:latest   app=nginx-pod


# 使用命令
# kubectl set image rs rs名称 容器=镜像版本 -n namespace
[root@master yaml]# kubectl set image rs pc-replicaset nginx=docker.io/library/nginx:1.23.1  -n default
replicaset.apps/pc-replicaset image updated

# 再次查看
# 镜像版本已经变更了
[root@master yaml]# kubectl get rs -n default -o wide
NAME            DESIRED   CURRENT   READY   AGE   CONTAINERS   IMAGES                           SELECTOR
pc-replicaset   2         2         2       17m   nginx        docker.io/library/nginx:1.23.1   app=nginx-pod
```

## 删除RS



~~~bash
# 使用kubectl delete命令会删除此RS以及它管理的Pod
# 在kubernetes删除RS前，会将RS的replicasclear调整为0，等待所有的Pod被删除后，在执行RS对象的删除
[root@master yaml]# kubectl delete rs pc-replicaset -n default
replicaset.apps "pc-replicaset" deleted

[root@master yaml]# kubectl get pod -n default -o wide
No resources found in default namespace.

# 如果希望仅仅删除RS对象（保留Pod），可以使用kubectl delete命令时添加--cascade=false选项（不推荐）。
[root@master yaml]# kubectl delete rs pc-replicaset -n default --cascade=false
replicaset.apps "pc-replicaset" deleted
[root@master yaml]# kubectl get pods -n default
NAME                  READY   STATUS    RESTARTS   AGE
pc-replicaset-cl82j   1/1     Running   0          75s
pc-replicaset-dslhb   1/1     Running   0          75s

# 也可以使用yaml直接删除(推荐)
[root@master yaml]#  kubectl delete -f Pc-Replicaset.yaml
replicaset.apps "pc-replicaset" deleted
~~~

# Deployment(Deploy)

## 概述

kubernetes在V1.2版本开始，引入了Deployment控制器。值得一提的是，这种控制器并不直接管理pod，而是通过管理ReplicaSet来简介管理Pod，即：Deployment管理ReplicaSet，ReplicaSet管理Pod。所以Deployment比ReplicaSet功能更加强大。

![Deployment](https://image.boychai.xyz/article/Kubernetes_pod_6.png)

Deployment主要功能有下面几个：

- 支持ReplicaSet的所有功能
- 支持发布的停止、继续
- 支持滚动升级和回滚版本

## 资源清单

```yaml
apiVersion: apps/v1 # 版本号
kind: Deployment # 类型       
metadata: # 元数据
  name: # deploy名称 
  namespace: # 所属命名空间 
  labels: #标签
spec: # 详情描述
  replicas: <副本数量>
  revisionHistoryLimit: <保留历史版本数量>
  paused: false # 暂停部署，默认是false
  progressDeadlineSeconds: 600 # 部署超时时间（s），默认是600
  strategy: # 策略
    type: <更新策略>
    rollingUpdate: # 滚动更新
      maxSurge: 30% # 最大额外可以存在的副本数，可以为百分比，也可以为整数
      maxUnavailable: 30% # 最大不可用状态的 Pod 的最大值，可以为百分比，也可以为整数
  selector: # 选择器，通过它指定该控制器管理哪些pod
    matchLabels:      # Labels匹配规则
    matchExpressions: # Expressions匹配规则
      - {key: <lableskey>, operator: <匹配方式>, values: <lablesvalue>}
  template: # 模板，当副本数量不足时，会根据下面的模板创建pod副本
    metadata:
      labels:
    spec:
      containers:
      - name: 
        image: 
        ports:
```

## 创建deploy

创建Pc-Deployment.yaml，内容如下

```yaml
apiVersion: apps/v1
kind: Deployment      
metadata:
  name: pc-deployment
  namespace: default
spec: 
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
```

```bash
# 创建deploy
[root@master yaml]# kubectl create -f Pc-Deployment.yaml --record=true
Flag --record has been deprecated, --record will be removed in the future
deployment.apps/pc-deployment created

# 查看deploy
# UP-TO-DATE 最新版本的pod的数量
# AVAILABLE  当前可用的pod的数量
[root@master yaml]# kubectl get deploy pc-deployment -n default
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
pc-deployment   3/3     3            3           85s

# 查看rs
# 发现rs的名称是在原来查看deploy的名字后面添加了一个10位数的随机串
[root@master yaml]# kubectl get rs -n default
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-6895856946   3         3         3       2m14s

# 查看pod
[root@master yaml]# kubectl get pods -n default
NAME                             READY   STATUS             RESTARTS          AGE
pc-deployment-6895856946-7nbs4   1/1     Running            0                 3m30s
pc-deployment-6895856946-g5n6g   1/1     Running            0                 3m30s
pc-deployment-6895856946-jkqnm   1/1     Running            0                 3m30s
```

## 扩缩容

```bash
# 命令方式
[root@master yaml]# kubectl scale deploy pc-deployment --replicas=5  -n default
deployment.apps/pc-deployment scaled

# 查看deploy
[root@master yaml]# kubectl get deploy pc-deployment -n default
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
pc-deployment   5/5     5            5           3m24s

# 查看pod数量
[root@master yaml]# kubectl get pods -n default
NAME                             READY   STATUS             RESTARTS          AGE
pc-deployment-6895856946-2tpfc   1/1     Running            0                 4m2s
pc-deployment-6895856946-5pn96   1/1     Running            0                 4m2s
pc-deployment-6895856946-792dj   1/1     Running            0                 4m2s
pc-deployment-6895856946-89vrz   1/1     Running            0                 117s
pc-deployment-6895856946-hl7pz   1/1     Running            0                 117s

# 在线编辑方式
# 修改spec.replicase为3
[root@master yaml]# kubectl edit deploy pc-deployment -n default
deployment.apps/pc-deployment edited

# 查看deploy
[root@master yaml]# kubectl get deploy pc-deployment -n default
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
pc-deployment   3/3     3            3           6m18s


# 查看pod数量
[root@master yaml]# kubectl get pods -n default
NAME                             READY   STATUS             RESTARTS          AGE
pc-deployment-6895856946-792dj   1/1     Running            0                 6m44s
pc-deployment-6895856946-89vrz   1/1     Running            0                 6m44s
pc-deployment-6895856946-792dj   1/1     Running            0                 6m44s
```

## 镜像更新

deployment支持两种更新策略:`重建更新`和`滚动更新`,可以通过`strategy`指定策略类型,支持两个属性:

```markdown
strategy：指定新的Pod替换旧的Pod的策略， 支持两个属性：
  type：指定策略类型，支持两种策略
    Recreate：在创建出新的Pod之前会先杀掉所有已存在的Pod
    RollingUpdate：滚动更新，就是杀死一部分，就启动一部分，在更新过程中，存在两个版本Pod
  rollingUpdate：当type为RollingUpdate时生效，用于为RollingUpdate设置参数，支持两个属性：
    maxUnavailable：用来指定在升级过程中不可用Pod的最大数量，默认为25%。
    maxSurge： 用来指定在升级过程中可以超过期望的Pod的最大数量，默认为25%。
```

### 重建更新

```bash
# 修改配置清单，并更新配置
# 修改spec.strategy.type为Recreate
[root@master yaml]# vim Pc-Deployment.yaml
[root@master yaml]# kubectl apply -f Pc-Deployment.yaml
deployment.apps/pc-deployment configured

# 命令方式更变镜像
[root@master yaml]# kubectl set image deployment pc-deployment nginx=docker.io/library/nginx:latest -n default
deployment.apps/pc-deployment image updated

# 查看升级过程
[root@master yaml]# kubectl get pods -n default -w
NAME                             READY   STATUS             RESTARTS        AGE
pc-deployment-6895856946-9zvpn   1/1     Terminating        0               5s
pc-deployment-6895856946-bnz2v   1/1     Terminating        0               5s
pc-deployment-6895856946-6dswz   0/1     Terminating        0               5s
pc-deployment-74556686fb-f76kc   0/1     Pending            0               0s
pc-deployment-74556686fb-g48rh   0/1     Pending            0               0s
pc-deployment-74556686fb-m2rvf   0/1     Pending            0               0s
pc-deployment-74556686fb-f76kc   0/1     ContainerCreating   0               0s
pc-deployment-74556686fb-g48rh   0/1     ContainerCreating   0               0s
pc-deployment-74556686fb-m2rvf   0/1     ContainerCreating   0               0s
pc-deployment-74556686fb-g48rh   1/1     Running             0               1s
pc-deployment-74556686fb-f76kc   1/1     Running             0               2s
pc-deployment-74556686fb-m2rvf   1/1     Running             0               2s
```

### 滚动更新

```bash
# 修改配置清单，并更新配置
# 修改spec.strategy.type为RollingUpdate,并添加rollingUpdate配置
[root@master yaml]# vim Pc-Deployment.yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 33%
      maxUnavailable: 33%
[root@master yaml]# kubectl apply -f Pc-Deployment.yaml
deployment.apps/pc-deployment configured

# 更变镜像
[root@master yaml]#  kubectl set image deployment pc-deployment nginx=docker.io/library/nginx:latest -n default
deployment.apps/pc-deployment image updated

# 查看升级过程
[root@master yaml]# kubectl get pod -n default -w
pc-deployment-6895856946-47gjm   1/1     Running            0                 2m33s
pc-deployment-6895856946-4rhkr   1/1     Running            0                 2m32s
pc-deployment-6895856946-6xg5w   1/1     Running            0                 2m30s
pc-deployment-74556686fb-7bz2k   0/1     Pending            0                 0s
pc-deployment-74556686fb-7bz2k   0/1     ContainerCreating   0                 0s
pc-deployment-74556686fb-7bz2k   1/1     Running             0                 1s
pc-deployment-6895856946-47gjm   1/1     Terminating         0                 2m43s
pc-deployment-74556686fb-xnvx5   0/1     Pending             0                 0s
pc-deployment-74556686fb-xnvx5   0/1     ContainerCreating   0                 0s
pc-deployment-74556686fb-xnvx5   1/1     Running             0                 2s
pc-deployment-6895856946-4rhkr   1/1     Terminating         0                 2m44s
pc-deployment-74556686fb-zgrss   0/1     Pending             0                 0s
pc-deployment-74556686fb-zgrss   0/1     ContainerCreating   0                 0s
pc-deployment-74556686fb-zgrss   1/1     Running             0                 1s
pc-deployment-6895856946-6xg5w   1/1     Terminating         0                 2m43s
# 至此，新版本的pod创建完毕，旧版本的pod销毁完毕
```

滚动更新的过程如下：

![滚动更新](https://image.boychai.xyz/article/Kubernetes_pod_7.png)

## 版本回退

在镜像更新之后，查看rs的变化，变化如下

```bash
# 查看rs,发现原来的rs的依旧存在，只是pod数量变为了0，而后又新产生了一个rs，pod数量为3，其实这就是deployment能够进行版本回退的奥妙所在，后面会详细解释。
[root@master yaml]# kubectl get rs -n default
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-6696798b78   0         0         0       7m37s
pc-deployment-6696798b11   0         0         0       5m37s
pc-deployment-c848d76789   3         3         3       72s
```

deployment支持版本升级过程中的暂停、继续功能以及版本回退等诸多功能，命令如下

```bash
kubectl rollout： 版本升级相关功能，支持下面的选项：
 status       显示当前升级状态
 history     显示 升级历史记录
 pause       暂停版本升级过程
 resume    继续已经暂停的版本升级过程
 restart      重启版本升级过程
 undo        回滚到上一级版本（可以使用--to-revision回滚到指定版本）
```

```yaml
# 查看当前升级版本的状态
[root@master yaml]# kubectl rollout status deploy pc-deployment -n default
deployment "pc-deployment" successfully rolled out

# 查看升级历史记录
[root@master yaml]# kubectl rollout history deploy pc-deployment -n default
deployment.apps/pc-deployment
REVISION  CHANGE-CAUSE
1         kubectl create --filename=Pc-Deployment.yaml --record=true
2         kubectl create --filename=Pc-Deployment.yaml --record=true
3         kubectl create --filename=Pc-Deployment.yaml --record=true

# 版本回滚
# --to-revision=1
# 1是最初创建的版本，2是上一个，3是现在的
[root@master yaml]# kubectl rollout undo deployment pc-deployment --to-revision=1 -n default
deployment.apps/pc-deployment rolled back

# 查看发现，通过nginx镜像版本可以发现到了最初版本
[root@master yaml]# kubectl get deploy -n default -o wide
NAME            READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES                           SELECTOR
pc-deployment   3/3     1            3           47m   nginx        docker.io/library/nginx:1.32.1   app=nginx-pod

# 查看rs，发现第一个rs中有3个pod运行，后面两个版本的rs中pod为运行
[root@master yaml]# kubectl get rs -n default
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-6696798b78   3         3         3       78m
pc-deployment-966bf7f44    0         0         0       37m
pc-deployment-c848d767     0         0         0       71m
```

## 金丝雀发布

Deployment控制器支持控制更新过程中的控制，如“暂停(pause)”或“继续(resume)”更新操作。比如有一批新的Pod资源创建完成后立即暂停更新过程，此时，仅存在一部分新版本的应用，主体部分还是旧的版本。然后，再筛选一小部分的用户请求路由到新版本的Pod应用，继续观察能否稳定地按期望的方式运行。确定没问题之后再继续完成余下的Pod资源滚动更新，否则立即回滚更新操作。这就是所谓的金丝雀发布。

```bash
# 更新deployment的版本，并配置暂停deployment
[root@master yaml]#  kubectl set image deploy pc-deployment nginx=docker.io/library/nginx:latest -n default && kubectl rollout pause deployment pc-deployment  -n default
deployment.apps/pc-deployment image updated
deployment.apps/pc-deployment paused

# 查看更新状态
[root@master yaml]# kubectl rollout status deploy pc-deployment -n default　
Waiting for deployment "pc-deployment" rollout to finish: 1 out of 3 new replicas have been updated...

# 查看rs
[root@master yaml]# kubectl get rs -n default -o wide
NAME                       DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES         
pc-deployment-5d89bdfbf9   2         2         2       19m     nginx        docker.io/library/nginx:1.32.1
pc-deployment-675d469f8b   0         0         0       14m     nginx        docker.io/library/nginx:latest
pc-deployment-6c9f56fcfb   1         1         1       3m16s   nginx        docker.io/library/nginx:1.32.1

# 查看Pod
[root@master yaml]# kubectl get rs -n default -o wide
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-5d89bdfbf9-rj8sq   1/1     Running   0          7m33s
pc-deployment-5d89bdfbf9-ttwgg   1/1     Running   0          7m35s
pc-deployment-6c9f56fcfb-j2gtj   1/1     Running   0          3m31s

# 继续更新
[root@master yaml]# kubectl rollout resume deploy pc-deployment -n default
deployment.apps/pc-deployment resumed

# 查看rs
[root@master yaml]# kubectl get rs -n default -o wide
NAME                       DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES         
pc-deployment-5d89bdfbf9   0         0         0       21m     nginx        docker.io/library/nginx:1.32.1
pc-deployment-675d469f8b   0         0         0       16m     nginx        docker.io/library/nginx:latest 
pc-deployment-6c9f56fcfb   3         3         3       5m11s   nginx        docker.io/library/nginx:1.32.1

# 查看Pod
[root@master yaml]# kubectl get pods -n default
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-6c9f56fcfb-996rt   1/1     Running   0          5m27s
pc-deployment-6c9f56fcfb-7bfwh   1/1     Running   0          37s
pc-deployment-6c9f56fcfb-rf84v   1/1     Running   0          37s
```

## 删除deploy

```bash
# 删除deployment，deploy管理的rs和pod将也会被删除
[root@master yaml]# kubectl delete -f Pc-Deployment.yaml
deployment.apps "pc-deployment" deleted
```

#  DaemonSet(DS)

## 概述

DaemonSet类型的控制器可以保证在集群中的每一台（或指定）节点上都运行一个副本。一般适用于日志收集、节点监控等场景。也就是说，如果一个Pod提供的功能是节点级别的（每个节点都需要且只需要一个），那么这类Pod就适合使用DaemonSet类型的控制器创建。

![DaemonSet](https://image.boychai.xyz/article/Kubernetes_pod_8.png)

## 特点

- 每当向集群中添加一个节点时，指定的 Pod 副本也将添加到该节点上
- 当节点从集群中移除时，Pod 也就被垃圾回收了

## 资源清单

```yaml
apiVersion: apps/v1 # 版本号
kind: DaemonSet # 类型       
metadata: # 元数据
  name: # ds名称 
  namespace: # 所属命名空间 
  labels: #标签
spec: # 详情描述
  revisionHistoryLimit: <保留历史版本>
  updateStrategy: # 更新策略
    type: RollingUpdate # 滚动更新策略
    rollingUpdate: # 滚动更新
      maxUnavailable: 1 # 最大不可用状态的 Pod 的最大值，可以为百分比，也可以为整数
  selector: # 选择器，通过它指定该控制器管理哪些pod
    matchLabels:      # Labels匹配规则
      - {key: value}
    matchExpressions: # Expressions匹配规则
      - {key: app, operator: In, values: [nginx-pod]}
  template: # 模板，当副本数量不足时，会根据下面的模板创建pod副本
    metadata:
      labels:
    spec:
      containers:
      - name: 
        image: 
        ports:
```

## 创建DS

创建文件Pc-Daemonset.yaml,内容如下

```yaml
apiVersion: apps/v1
kind: DaemonSet      
metadata:
  name: pc-daemonset
  namespace: default
spec: 
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
```

```bash
# 创建DS
[root@master yaml]# kubectl create -f Pc-Daemonset.yaml
daemonset.apps/pc-daemonset created

# 查看DS
[root@master yaml]# kubectl get ds -n default -o wide
NAME           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE    CONTAINERS   IMAGES                           SELECTOR
pc-daemonset   2         2         2       2            2           <none>          104s   nginx        docker.io/library/nginx:1.23.1   app=nginx-pod

# 查看pod,发现在每个work节点上都运行一个pod
[root@master yaml]# kubectl get pods -n default -o wide
NAME                             READY   STATUS             RESTARTS          AGE     IP              NODE             NOMINATED NODE   READINESS GATES
pc-daemonset-h6q4b               1/1     Running            0                 2m23s   10.244.67.78    work1.host.com   <none>           <none>
pc-daemonset-lghrj               1/1     Running            0                 2m23s   10.244.52.209   work2.host.com   <none>           <none>
```

## 删除DS

```yaml
# 删除DS
[root@master yaml]# kubectl delete -f Pc-dDaemonset.yaml
daemonset.apps "pc-daemonset" deleted
```

# Job

## 概述

Job，主要用于负责**批量处理(一次要处理指定数量任务)**短暂的**一次性(每个任务仅运行一次就结束)**任务。Job特点如下：

- 当Job创建的pod执行成功结束时，Job将记录成功结束的pod数量
- 当成功结束的pod达到指定的数量时，Job将完成执行

![Job](https://image.boychai.xyz/article/Kubernetes_pod_9.png)

## 资源清单

```yaml
apiVersion: batch/v1 # 版本号
kind: Job # 类型       
metadata: # 元数据
  name: # rs名称 
  namespace: # 所属命名空间 
  labels: #标签
    controller: job
spec: # 详情描述
  completions: 1 # 指定job需要成功运行Pods的次数。默认值: 1
  parallelism: 1 # 指定job在任一时刻应该并发运行Pods的数量。默认值: 1
  activeDeadlineSeconds: <可运行时间期限> # 指定job可运行的时间期限，超过时间还未结束，系统将会尝试进行终止。
  backoffLimit: 6 # 指定job失败后进行重试的次数。默认是6
  manualSelector: false # 是否可以使用selector选择器选择pod，默认是false
  selector: # 选择器，通过它指定该控制器管理哪些pod
    matchLabels:      # Labels匹配规则
	  - {key: value}
    matchExpressions: # Expressions匹配规则
      - {key: app, operator: In, values: [counter-pod]}
  template: # 模板，当副本数量不足时，会根据下面的模板创建pod副本
    metadata:
      labels:
    spec:
      restartPolicy: <重启策略> # 重启策略只能设置为Never或者OnFailure
      containers:
      - name: 
        image: 
        command: 
```

```markdown
关于重启策略设置的说明：
    如果指定为OnFailure，则job会在pod出现故障时重启容器，而不是创建pod，failed次数不变
    如果指定为Never，则job会在pod出现故障时创建新的pod，并且故障pod不会消失，也不会重启，failed次数加1
    如果指定为Always的话，就意味着一直重启，意味着job任务会重复去执行了，当然不对，所以不能设置为Always
```

## 创建Job

创建Pc-Job.yaml,内容如下

```yaml
apiVersion: batch/v1
kind: Job      
metadata:
  name: pc-job
  namespace: default
spec:
  manualSelector: true
  selector:
    matchLabels:
      app: counter-pod
  template:
    metadata:
      labels:
        app: counter-pod
    spec:
      restartPolicy: Never
      containers:
      - name: counter
        image: docker.io/library/busybox:1.35.0
        command: ["bin/sh","-c","for i in 9 8 7 6 5 4 3 2 1; do echo $i;sleep 3;done"]
```

```bash
# 创建Job
[root@master yaml]# kubectl create -f Pc-Job.yaml
job.batch/pc-job created

# 持续观察Job状态
[root@master yaml]# kubectl get job -n default -o wide -w
NAME     COMPLETIONS   DURATION   AGE   CONTAINERS   IMAGES                             SELECTOR
pc-job   0/1           1s         1s    counter      docker.io/library/busybox:1.35.0   app=counter-pod
pc-job   0/1           3s         3s    counter      docker.io/library/busybox:1.35.0   app=counter-pod


# 查看Pod状态
# 可以发现pod运行完命令之后就会边车Completed
[root@master yaml]# kubectl get pod -n default -o wide -w
NAME                             READY   STATUS             RESTARTS          AGE     IP              NODE             NOMINATED NODE   READINESS GATES
pc-job-6qwpd                     1/1     Running          0                   29s   10.244.67.81    work1.host.com   <none>           <none>
pc-job-6qwpd                     0/1     Completed          0                 119s   10.244.67.81    work1.host.com   <none>           <none>
```

## 删除Job

```bash
# 删除job
[root@master yaml]# kubectl delete -f Pc-Job.yaml
job.batch "pc-job" deleted
```

# CronJob(CJ)

## 概述

CronJob控制器以Job控制器资源为其管控对象，并借助它管理pod资源对象，Job控制器定义的作业任务在其控制器资源创建之后便会立即执行，但CronJob可以以类似于Linux操作系统的周期性任务作业计划的方式控制其运行**时间点**及**重复运行**的方式。也就是说，**CronJob可以在特定的时间点(反复的)去运行job任务**。

![CJ](https://image.boychai.xyz/article/Kubernetes_pod_10.png)

## 资源清单

```yaml
apiVersion: batch/v1beta1 # 版本号
kind: CronJob # 类型       
metadata: # 元数据
  name: # rs名称 
  namespace: # 所属命名空间 
  labels: #标签
    controller: cronjob
spec: # 详情描述
  schedule: # cron格式的作业调度运行时间点,用于控制任务在什么时间执行
  concurrencyPolicy: # 并发执行策略，用于定义前一次作业运行尚未完成时是否以及如何运行后一次的作业
  failedJobHistoryLimit: # 为失败的任务执行保留的历史记录数，默认为1
  successfulJobHistoryLimit: # 为成功的任务执行保留的历史记录数，默认为3
  startingDeadlineSeconds: # 启动作业错误的超时时长
  jobTemplate: # job控制器模板，用于为cronjob控制器生成job对象;下面其实就是job的定义
    metadata:
    spec:
      completions: 1
      parallelism: 1
      activeDeadlineSeconds: 30
      backoffLimit: 6
      manualSelector: true
      selector:
        matchLabels:
        matchExpressions: 规则
          - {key: app, operator: In, values: [counter-pod]}
      template:
        metadata:
          labels:
        spec:
          restartPolicy: 
          containers:
          - name: 
            image: 
            command: 
```

```markdown
需要重点解释的几个选项：
schedule: cron表达式，用于指定任务的执行时间
	*/1    *      *    *     *
	<分钟> <小时> <日> <月份> <星期>

    分钟 值从 0 到 59.
    小时 值从 0 到 23.
    日 值从 1 到 31.
    月 值从 1 到 12.
    星期 值从 0 到 6, 0 代表星期日
    多个时间可以用逗号隔开； 范围可以用连字符给出；*可以作为通配符； /表示每...
concurrencyPolicy:
	Allow:   允许Jobs并发运行(默认)
	Forbid:  禁止并发运行，如果上一次运行尚未完成，则跳过下一次运行
	Replace: 替换，取消当前正在运行的作业并用新作业替换它
```

## 创建CJ

创建Pc-Cronjob.yaml,内容如下:

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: pc-cronjob
  namespace: default
  labels:
    controller: cronjob
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    metadata:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: counter
            image: docker.io/library/busybox:1.35.0
            command: ["bin/sh","-c","for i in 9 8 7 6 5 4 3 2 1; do echo $i;sleep 3;done"]
```

```bash
# 创建CJ
[root@master yaml]# kubectl create -f Pc-Cronjob.yaml
Warning: batch/v1beta1 CronJob is deprecated in v1.21+, unavailable in v1.25+; use batch/v1 CronJob
cronjob.batch/pc-cronjob created

# 查看CJ
[root@master yaml]# kubectl get cronjobs -n default
NAME         SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
pc-cronjob   */1 * * * *   False     1        9s              58s

# 查看job
[root@master yaml]# kubectl get job -n default
NAME                  COMPLETIONS   DURATION   AGE
pc-cronjob-27705149   0/1           2m8s       2m8s
pc-cronjob-27705150   0/1           68s        68s
pc-cronjob-27705151   0/1           8s         8s

# 查看pod
[root@master yaml]# kubectl get pods -n default
NAME                             READY   STATUS             RESTARTS          AGE
pc-cronjob-27705149-kms26        0/1     Completed   0                 2m37s
pc-cronjob-27705150-2mvkv        0/1     Completed   0                 97s
pc-cronjob-27705151-dvr8c        1/1     Running       0                 37s
```

## 删除CJ

```bash
[root@master yaml]# kubectl delete -f Pc-Cronjob.yaml
Warning: batch/v1beta1 CronJob is deprecated in v1.21+, unavailable in v1.25+; use batch/v1 CronJob
cronjob.batch "pc-cronjob" deleted
```

