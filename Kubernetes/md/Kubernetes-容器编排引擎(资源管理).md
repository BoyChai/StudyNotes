# 什么是资源？

K8s中所有的内容都抽象为资源,资源实例化之后,叫做对象。

# 资源列表

**工作负载类**

Pod、ReplicaSet、Deployment、StatefulSet、DaemonSet、Job、CronJob(ReplicationController在v1.11版本被废弃)

**服务发现和负载均衡类**

Service、Ingress、...

**存储类**

Volume、CSI

**配置类**

ConfigMap、Secret、DownwardAPI

**集群类**

Namespace、Node、Role、ClusterRole、RoleBinding、ClusterRoleBinding

**元数据类**

HPA、PodTemplate、LimitRange

# 资源清单
## 什么是资源清单？
在K8S中，一般使用yaml格式的文件来创建符合我们预期期望的pod，这样的yaml文件我们一般称为资源清单。
##资源清单格式
## 资源清单格式

```yaml
apiVersion: group/apiversion  
kind:       
metadata：  
spec:
status：
```
**apiVersion:**如果没有给定group名称，那么默认为croe，可以使用kubectl api-versions 获取当前k8s版本上所有的apiVersion版本信息(每个版本可能不同),也可以通过kubectl explain 资源名称|grep VERSION来获取相应资源的apiversion
**kind:**资源类别
**metadata:**资源元数据
**spec:**期望的状态（disired state）
**status:**当前状态，本字段有kubernetes自身维护，用户不能去定义

## 清单格式帮助

以pod资源为例，想要查看pod资源的资源清单格式可以使用一下命令

```bash
kubectl explain pod
```

使用上面命令只能看到一级配置，想要看二级的，例如metadata、spec，可以使用一下命令

```bash
kubectl explain pod.metadata
kubectl explain pod.spec
```

# Namespace

## 什么是Namespace？

Namespace也称为命名空间是kubernetes系统中的一种非常重要资源，它的主要作用是用来实现**多套环境的资源隔离**或者**多租户的资源隔离**。

##  作用

默认情况下，kubernetes集群中的所有的Pod都是可以相互访问的。但是在实际中，可能不想让两个Pod之间进行互相的访问，那此时就可以将两个Pod划分到不同的namespace下。kubernetes通过将集群内部的资源分配到不同的Namespace中，可以形成逻辑上的"组"，以方便不同的组的资源进行隔离使用和管理。可以通过kubernetes的授权机制，将不同的namespace交给不同租户进行管理，这样就实现了多租户的资源隔离。此时还能结合kubernetes的资源配额机制，限定不同租户能占用的资源，例如CPU使用量、内存使用量等等，来实现租户可用资源的管理。

## 管理

- 列出全部的命名空间

```bash
kubectl get ns
```

- 创建命名空间

```bash
kubectl create ns dev
```

- 删除命名空间

```
kubectl delete ns dev
```

- 资源清单

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

 创建：kubectl  create  -f  ns-dev.yaml

 删除：kubectl  delete  -f  ns-dev.yaml

# 资源管理

## 资源管理方式

- 命令式对象管理：直接使用命令去操作kubernetes资源
- 命令式对象配置：通过命令配置和配置文件去操作kubernetes资源
- 声明式对象配置：通过apply命令和配置文件去操作kubernetes资源

## 命令式对象管理

### 格式

kubectl命令就是kubernetes集权管理的命令行工具,通过它能够对集群本身进行管理,并能够在集群上进行容器化应用的安装部署。命令语法如下:

```bash
kubectl [command] [type] [name] [flags]
```

**comand**：指定要对资源执行的操作，例如create、get、delete

**type**：指定资源类型，比如deployment、pod、service

**name**：指定资源的名称，名称大小写敏感

**flags**：指定额外的可选参数

### command

#### 基本命令

| 命令    | 命令作用     |
| ------- | ------------ |
| create  | 创建一个资源 |
| edit    | 编辑一个资源 |
| get     | 获取一个资源 |
| patch   | 更新一个资源 |
| delete  | 删除一个资源 |
| explain | 显示资源文档 |

#### 运行调试

| 命令      | 命令作用                   |
| --------- | -------------------------- |
| run       | 在集群中运行一个指定的镜像 |
| expose    | 暴露资源为Service          |
| describe  | 显示资源内部信息           |
| logs      | 输出容器在Pod中的日志      |
| attach    | 进入运行中的容器           |
| exec      | 执行容器中的一个命令       |
| cp        | 在Pod和内外复制文件        |
| rollout   | 管理资源的发布             |
| scale     | 扩(缩)容Pod的数量          |
| autoscale | 自动调整Pod的数量          |

#### 其他命令

| 命令         | 命令作用                     |
| ------------ | ---------------------------- |
| apply        | 通过文件对资源进行创建或更新 |
| label        | 更新资源上的标签             |
| cluster-info | 显示集群信息                 |
| version      | 显示当前Client和Server的版本 |

### type

资源资源类型，这里不进行列举了,上面已经说过。

## 命令式对象配置

命令式对象配置就是使用命令配合资源清单来使用

资源清单创建好之后使用下面命令进行操作

**创建资源:**`kubectl create -f 资源清单`
**查看资源:**`kubectl get -f 资源清单`
**删除资源:**`kubectl delete -f 资源清单`

## 声明式对象配置

声明式对象配置跟命令式对象配置很相似，但是它只有一个命令apply。

和命令式对象配置的区别就在于命令式是用来创建删除的，而声明式是用来修改的，当资源清单修改后可以使用下面命令对资源对进行更新

**更新资源:**`kubectl apply -f 资源清单`