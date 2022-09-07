# Service概述

在kubernetes中，pod是应用程序的载体，可以通过pod的ip来访问应用程序，但是pod的ip地址不是固定的，这也就意味着不方便直接采用pod的ip对服务进行访问。为了解决这个问题，kubernetes提供了Service资源，Service会对提供同一个服务的多个pod进行聚合，并且提供一个统一的入口地址。通过访问Service的入口地址就能访问到后面的pod服务。

![Service](https://image.boychai.xyz/article/Kubernetes_pod_11.png)

Service在很多情况下只是一个概念，真正起作用的其实是kube-proxy服务进程，每个Node节点上都运行着一个kube-proxy服务进程。当创建Service的时候会通过api-server向etcd写入创建的service的信息，而kube-proxy会基于监听的机制发现这种Service的变动，然后**它会将最新的Service信息转换成对应的访问规则**。

![Service](https://image.boychai.xyz/article/Kubernetes_pod_12.png)

# 工作模式

## userspace 模式

userspace模式下，kube-proxy会为每一个Service创建一个监听端口，发向Cluster IP的请求被Iptables规则重定向到kube-proxy监听的端口上，kube-proxy根据LB算法选择一个提供服务的Pod并和其建立链接，以将请求转发到Pod上。该模式下，kube-proxy充当了一个四层负责均衡器的角色。由于kube-proxy运行在userspace中，在进行转发处理时会增加内核和用户空间之间的数据拷贝，虽然比较稳定，但是效率比较低。

![Service](https://image.boychai.xyz/article/Kubernetes_pod_13.png)

## iptables模式

iptables模式下，kube-proxy为service后端的每个Pod创建对应的iptables规则，直接将发向Cluster IP的请求重定向到一个Pod IP。该模式下kube-proxy不承担四层负责均衡器的角色，只负责创建iptables规则。该模式的优点是较userspace模式效率更高，但不能提供灵活的LB策略，当后端Pod不可用时也无法进行重试。

![Service](https://image.boychai.xyz/article/Kubernetes_pod_14.png)

## ipvs模式

ipvs模式和iptables类似，kube-proxy监控Pod的变化并创建相应的ipvs规则。ipvs相对iptables转发效率更高。除此以外，ipvs支持更多的LB算法。

![Service](https://image.boychai.xyz/article/Kubernetes_pod_15.png)

## 设置工作模式

```bash
# 以ipvs为例，使用之前请安装ipvs模块(安装集群时已经安装)
# 编辑kube-proxy cm修改mode为"ipvs"
[root@master yaml]# kubectl edit cm kube-proxy -n kube-system
configmap/kube-proxy edited
......
    mode: "ipvs"
......

# 删除kube-proxy使其自动重启更新配置
[root@master yaml]# kubectl delete pod -l k8s-app=kube-proxy -n kube-system
pod "kube-proxy-5r4xw" deleted
pod "kube-proxy-qww6b" deleted
pod "kube-proxy-th7hm" deleted

# 查看ipvs规则
# 发现配置已生效
[root@master yaml]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  10.96.0.1:443 rr
  -> 192.16.1.10:6443             Masq    1      0          0
TCP  10.96.0.10:53 rr
  -> 10.244.52.213:53             Masq    1      0          0
  -> 10.244.52.218:53             Masq    1      0          0
TCP  10.96.0.10:9153 rr
  -> 10.244.52.213:9153           Masq    1      0          0
  -> 10.244.52.218:9153           Masq    1      0          0
UDP  10.96.0.10:53 rr
  -> 10.244.52.213:53             Masq    1      0          0
  -> 10.244.52.218:53             Masq    1      0          0
```

# Service资源清单

```yaml
kind: Service  # 资源类型
apiVersion: v1  # 资源版本
metadata: # 元数据
  name: service # 资源名称
  namespace: <命名空间>
spec: # 描述
  selector: # 标签选择器，用于确定当前service代理哪些pod
  type: <Service类型>
  clusterIP: <虚拟服务的ip地址>
  sessionAffinity: # session亲和性，支持ClientIP、None两个选项
  ports: # 端口信息
    - protocol: <协议> 
      port: <service端口>
      targetPort: <pod端口>
      nodePort: <主机端口>
```

Service类型如下:

- ClusterIP：默认值，它是Kubernetes系统自动分配的虚拟IP，只能在集群内部访问
- NodePort：将Service通过指定的Node上的端口暴露给外部，通过此方法，就可以在集群外部访问服务
- LoadBalancer：使用外接负载均衡器完成到服务的负载分发，注意此模式需要外部云环境支持
- ExternalName： 把集群外部的服务引入集群内部，直接使用

# Service使用

## 实验环境

在使用service之前，首先利用Deployment创建出3个pod，注意要为pod设置`app=nginx-pod`的标签。

创建Service-Env.yaml，内容如下

```yaml
apiVersion: apps/v1
kind: Deployment      
metadata:
  name: service-env
  namespace: default
spec: 
  replicas: 3
  selector:
    matchLabels:
      app: service-env
  template:
    metadata:
      labels:
        app: service-env
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
        ports:
        - containerPort: 80
```

```bash
# 创建deploy
[root@master yaml]# kubectl create -f Service-Env.yaml
deployment.apps/service-env created

# 查看pod详情
[root@master yaml]# kubectl get pods -n default -o wide --show-labels
NAME                             READY   STATUS             RESTARTS          AGE     IP              NODE             NOMINATED NODE   READINESS GATES   LABELS
service-env-77bd9f74d4-7qntr     1/1     Running            0                 108s    10.244.52.222   work2.host.com   <none>           <none>
service-env-77bd9f74d4-9hs5k     1/1     Running            0                 108s    10.244.67.84    work1.host.com   <none>           <none>
service-env-77bd9f74d4-s5hh5     1/1     Running            0                 108s    10.244.67.79    work1.host.com   <none>           <none>

# 为了方便测试修改nginx的访问页面为podip
# 给容器依次修改
[root@master yaml]# kubectl exec -it service-env-77bd9f74d4-7qntr -n default /bin/sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
# echo 10.244.52.222 > /usr/share/nginx/html/index.html
# exit
[root@master yaml]# kubectl exec -it service-env-77bd9f74d4-9hs5k -n default /bin/sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
# echo 10.244.67.84 > /usr/share/nginx/html/index.html
# exit
[root@master yaml]# kubectl exec -it service-env-77bd9f74d4-s5hh5 -n default /bin/sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
# echo 10.244.67.79 > /usr/share/nginx/html/index.html
# exit


# 访问测试
[root@master yaml]# curl 10.244.52.222
10.244.52.222
[root@master yaml]# curl 10.244.67.84
10.244.67.84
[root@master yaml]# curl 10.244.67.79
10.244.67.79
```

## ClusterIP

创建Service-Clusterip.yaml，内容如下

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-clusterip
  namespace: default
spec:
  selector:
    app: service-env
  clusterIP: 10.97.1.1 # service的ip地址，如果不写，默认会生成一个
  type: ClusterIP
  ports:
  - port: 80  # Service端口       
    targetPort: 80 # pod端口
```

```yaml
# 创建service
[root@master yaml]# kubectl create -f Service-Clusterip.yaml
service/service-clusterip created

# 查看service
[root@master yaml]# kubectl get svc -n default -o wide
NAME                TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE     SELECTOR
kubernetes          ClusterIP   10.96.0.1    <none>        443/TCP   2d18h   <none>
service-clusterip   ClusterIP   10.97.1.1    <none>        80/TCP    4m42s   app=service-env

# 查看service详情
# 里面有一个Endpoints,里面就是pod入口
[root@master yaml]# kubectl describe svc service-clusterip -n default
Name:              service-clusterip
Namespace:         default
Labels:            <none>
Annotations:       <none>
Selector:          app=service-env
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.97.1.1
IPs:               10.97.1.1
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.244.52.222:80,10.244.67.79:80,10.244.67.84:80
Session Affinity:  None
Events:            <none>

# 查看ipvs的映射规则
[root@master yaml]# ipvsadm -Ln
......
TCP  10.97.1.1:80 rr
  -> 10.244.52.222:80             Masq    1      0          0
  -> 10.244.67.79:80              Masq    1      0          0
  -> 10.244.67.84:80              Masq    1      0          0
......
# 访问测试
# http://10.97.1.1:80
[root@master yaml]# curl http://10.97.1.1:80
10.244.67.84
[root@master yaml]# curl http://10.97.1.1:80
10.244.67.79
[root@master yaml]# curl http://10.97.1.1:80
10.244.52.222
```

##  HeadLiness

Endpoint是kubernetes中的一个资源对象，存储在etcd中，用来记录一个service对应的所有pod的访问地址，它是根据service配置文件中selector描述产生的。一个Service由一组Pod组成，这些Pod通过Endpoints暴露出来，**Endpoints是实现实际服务的端点集合**。换句话说，service和pod之间的联系是通过endpoints实现的。

创建Service-Headliness.yaml，内容如下

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-headliness
  namespace: default
spec:
  selector:
    app: service-env
  clusterIP: None # 将clusterIP设置为None，即可创建headliness Service
  type: ClusterIP
  ports:
  - port: 80    
    targetPort: 80
```

```yaml
# 创建service
[root@master yaml]# kubectl create -f Service-Headliness.yaml
service/service-headliness created

# 查看service
# 发现CLUSTER-IP未分配IP
[root@master yaml]# kubectl get svc service-headliness -n default -o wide
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE   SELECTOR
service-headliness   ClusterIP   None         <none>        80/TCP    43s   app=service-env


# 查看service详情
[root@master yaml]# kubectl describe svc service-headliness  -n default
Name:              service-headliness
Namespace:         default
Labels:            <none>
Annotations:       <none>
Selector:          app=service-env
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                None
IPs:               None
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.244.52.222:80,10.244.67.79:80,10.244.67.84:80
Session Affinity:  None
Events:            <none>

# 查看域名的解析情况
[root@master yaml]# kubectl exec -it pc-deployment-6895856946-9b24j -n default /bin/sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
# cat /etc/resolv.conf
search default.svc.cluster.local svc.cluster.local cluster.local host.com
nameserver 10.96.0.10
options ndots:5
# exit

# 查看域名解析记录
[root@master yaml]# dig @10.96.0.10 service-headliness.default.svc.cluster.local +short
10.244.67.84
10.244.52.222
10.244.67.79
```

## NodePort

如果希望将Service暴露给集群外部使用，那么就要使用到另外一种类型的Service，称为NodePort类型。NodePort的工作原理其实就是**将service的端口映射到Node的一个端口上**，然后就可以通过`NodeIp:NodePort`来访问service了。

![NodePort](https://image.boychai.xyz/article/Kubernetes_pod_16.png)

创建Service-Nodeport.yaml,内容如下

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-nodeport
  namespace: default
spec:
  selector:
    app: service-env
  type: NodePort # service类型
  ports:
  - port: 80
    nodePort: 30002 # 指定绑定的node的端口(默认的取值范围是：30000-32767), 如果不指定，会默认分配
    targetPort: 80
```

```bash
# 创建service
[root@master yaml]# kubectl create -f  Service-Nodeport.yaml
service/service-nodeport created

# 查看service
[root@master yaml]# kubectl get svc -n default -o wide
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE     SELECTOR
service-nodeport     NodePort    10.101.89.79   <none>        80:30002/TCP   20s     app=service-env

# 访问测试
# 访问每个节点的30002端口
[root@master yaml]# curl http://master.host.com:30002
10.244.67.84
[root@master yaml]# curl http://work1.host.com:30002
10.244.67.79
[root@master yaml]# curl http://work2.host.com:30002
10.244.67.84
```

## LoadBalancer

LoadBalancer和NodePort很相似，目的都是向外部暴露一个端口，区别在于LoadBalancer会在集群的外部再来做一个负载均衡设备，而这个设备需要外部环境支持的，外部服务发送到这个设备上的请求，会被设备负载之后转发到集群中。实现LoadBalancer需要外部设备，这里不做演示。

![LoadBalancer](https://image.boychai.xyz/article/Kubernetes_pod_17.png)

## ExternalName

ExternalName类型的Service用于引入集群外部的服务，它通过`externalName`属性指定外部一个服务的地址，然后在集群内部访问此service就可以访问到外部的服务了。

![ExternalName](https://image.boychai.xyz/article/Kubernetes_pod_18.png)

创建Service-Externalname.yaml，内容如下

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-externalname
  namespace: default
spec:
  type: ExternalName # service类型
  externalName: www.baidu.com  #改成ip地址也可以
```

```bash
# 创建service
[root@master yaml]# kubectl create -f Service-Externalname.yaml
service/service-externalname created

# 查看域名解析记录
[root@master yaml]# dig @10.96.0.10 service-externalname.default.svc.cluster.local +short
www.baidu.com.
39.156.66.14
39.156.66.18
```

## 注意

service域名解析记录的域名组成如下

```markdown
[资源名称].[命名空间].svc.cluster.local
```



