#  Ingress概述

Service对集群之外暴露服务的主要方式有两种：NotePort和LoadBalancer，但是这两种方式，都有一定的缺点：

- NodePort方式的缺点是会占用很多集群机器的端口，那么当集群服务变多的时候，这个缺点就愈发明显
- LB方式的缺点是每个service需要一个LB，浪费、麻烦，并且需要kubernetes之外设备的支持

基于这种现状，kubernetes提供了Ingress资源对象，Ingress只需要一个NodePort或者一个LB就可以满足暴露多个Service的需求。工作机制大致如下图表示：

![Service](https://image.boychai.xyz/article/Kubernetes_pod_19.png)

实际上，Ingress相当于一个7层的负载均衡器，是kubernetes对反向代理的一个抽象，它的工作原理类似于Nginx，可以理解成在**Ingress里建立诸多映射规则，Ingress Controller通过监听这些配置规则并转化成Nginx的反向代理配置 , 然后对外部提供服务**。在这里有两个核心概念：

- ingress：kubernetes中的一个对象，作用是定义请求如何转发到service的规则
- ingress controller：具体实现反向代理及负载均衡的程序，对ingress定义的规则进行解析，根据配置的规则来实现请求转发，实现方式有很多，比如Nginx, Contour, Haproxy等等

Ingress（以Nginx为例）的工作原理如下：

1. 用户编写Ingress规则，说明哪个域名对应kubernetes集群中的哪个Service
2. Ingress控制器动态感知Ingress服务规则的变化，然后生成一段对应的Nginx反向代理配置
3. Ingress控制器会将生成的Nginx配置写入到一个运行着的Nginx服务中，并动态更新
4. 到此为止，其实真正在工作的就是一个Nginx了，内部配置了用户定义的请求转发规则

![Service](https://image.boychai.xyz/article/Kubernetes_pod_20.png)

# Ingress使用

## 环境配置

环境为3个deploy，分别部署3个pod，镜像依次为nginx，apache，tomcat，并对应部署了三个service

创建文件Ingress-Env.yaml，内容如下

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-env-nginx
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      ingress-env: nginx-pod
  template:
    metadata:
      labels:
        ingress-env: nginx-pod
    spec:
      containers:
      - name: nginx
        image: docker.io/library/nginx:1.23.1
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-env-httpd
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      ingress-env: httpd-pod
  template:
    metadata:
      labels:
        ingress-env: httpd-pod
    spec:
      containers:
      - name: httpd
        image: docker.io/library/httpd:2.4.54
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-env-tomcat
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      ingress-env: tomcat-pod
  template:
    metadata:
      labels:
        ingress-env: tomcat-pod
    spec:
      containers:
      - name: tomcat
        image: docker.io/library/tomcat:8.5-jre10-slim
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-env-nginx-svc
  namespace: default
spec:
  selector:
    ingress-env: nginx-pod
  clusterIP: 10.97.2.1 # service的ip地址，如果不写，默认会生成一个
  type: ClusterIP
  ports:
  - port: 80  # Service端口
    targetPort: 80 # pod端口
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-env-httpd-svc
  namespace: default
spec:
  selector:
    ingress-env: httpd-pod
  clusterIP: 10.97.2.2 # service的ip地址，如果不写，默认会生成一个
  type: ClusterIP
  ports:
  - port: 80  # Service端口
    targetPort: 80 # pod端口
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-env-tomcat-svc
  namespace: default
spec:
  selector:
    ingress-env: tomcat-pod
  clusterIP: 10.97.2.3 # service的ip地址，如果不写，默认会生成一个
  type: ClusterIP
  ports:
  - port: 80  # Service端口
    targetPort: 8080 # pod端口

```

```bash
# 创建环境
[root@master yaml]# kubectl create -f Ingress-Env.yaml
deployment.apps/ingress-env-nginx created
deployment.apps/ingress-env-httpd created
deployment.apps/ingress-env-tomcat created
service/ingress-env-nginx-svc created
service/ingress-env-httpd-svc created
service/ingress-env-tomcat-svc created

# 查看Pod
[root@master yaml]# kubectl get pod -n default
NAME                                  READY   STATUS             RESTARTS          AGE
ingress-env-httpd-59b9f557c4-gjvhn    1/1     Running            0                 15s
ingress-env-httpd-59b9f557c4-j6q9b    1/1     Running            0                 15s
ingress-env-httpd-59b9f557c4-zp9fv    1/1     Running            0                 15s
ingress-env-nginx-7d899c7648-4r7gx    1/1     Running            0                 15s
ingress-env-nginx-7d899c7648-6fzq9    1/1     Running            0                 15s
ingress-env-nginx-7d899c7648-stv77    1/1     Running            0                 15s
ingress-env-tomcat-679896868f-27zhq   1/1     Running            0                 15s
ingress-env-tomcat-679896868f-w9gd6   1/1     Running            0                 15s
ingress-env-tomcat-679896868f-wwwnn   1/1     Running            0                 15s

# 查看deploy
[root@master yaml]# kubectl get deploy -n default
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
ingress-env-httpd    3/3     3            3           31s
ingress-env-nginx    3/3     3            3           31s
ingress-env-tomcat   3/3     3            3           31s


# 查看svc
[root@master yaml]# kubectl get svc -n default
NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
ingress-env-httpd-svc    ClusterIP      10.97.2.2       <none>          80/TCP         44s
ingress-env-nginx-svc    ClusterIP      10.97.2.1       <none>          80/TCP         44s
ingress-env-tomcat-svc   ClusterIP      10.97.2.3       <none>          80/TCP         44s

# 测试svc
# 都有页面返回即可
[root@master yaml]# curl 10.97.2.1
......
<h1>Welcome to nginx!</h1>
......
[root@master yaml]# curl 10.97.2.2
<html><body><h1>It works!</h1></body></html>
[root@master yaml]# curl 10.97.2.3
......
                    <h2>If you're seeing this, you've successfully installed Tomcat. Congratulations!</h2>
......
```



## Ingress-nginx安装

```yaml
# 下载Ingress的部署资源清单
# 我这里的版本是v1.3.0
[root@master yaml]# curl -o Ingress-Deploy.yaml https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15490  100 15490    0     0  15694      0 --:--:-- --:--:-- --:--:-- 15678

# 替换镜像
# Ingress-Deploy里面会用到两个镜像
# 一个是ingress-nginx/controller:1.3.0还有一个是ingress-nginx-kube-webhook-certgen:v1.1.1
# 默认都是从k8s镜像仓库下载的,都被墙了,需要把这两个修改为其他的，这里我自己科学上网pull下来放到仓库了修改内容如下
# 注意一共有三个镜像配置，有两个kube-webhook-certgen，三个都要改
image: registry.k8s.io/ingress-nginx/controller:v1.3.0... > image: docker.io/boychai/ingress-nginx-controlle:v1.3.0
image 
image: registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.1.1... > image: docker.io/boychai/ingress-nginx-kube-webhook-certgen:v1.1.1

# 添加hostNetwork配置
# 在Ingress-Deploy的里面会有段Deployment的配置大概在388行
# 在Deployment.spec.template.spec添加hostNetwork:true
......
412		spec:
413       hostNetwork: true
414       containers:
415       - args:
416         - /nginx-ingress-controller
417         - --publish-service=$(POD_NAMESPACE)/ingress-nginx-controller
......

# 创建Ingress-Nginx
[root@master yaml]# kubectl create -f Ingress-Deploy.yaml
namespace/ingress-nginx created
serviceaccount/ingress-nginx created
serviceaccount/ingress-nginx-admission created
role.rbac.authorization.k8s.io/ingress-nginx created
role.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrole.rbac.authorization.k8s.io/ingress-nginx created
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
rolebinding.rbac.authorization.k8s.io/ingress-nginx created
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
configmap/ingress-nginx-controller created
service/ingress-nginx-controller created
service/ingress-nginx-controller-admission created
deployment.apps/ingress-nginx-controller created
job.batch/ingress-nginx-admission-create created
job.batch/ingress-nginx-admission-patch created
ingressclass.networking.k8s.io/nginx created
validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created

# 查看pod 
[root@master yaml]# kubectl get pod -n ingress-nginx
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-69hcz        0/1     Completed   0          50s
ingress-nginx-admission-patch-pwm7c         0/1     Completed   0          49s
ingress-nginx-controller-7fc79df64f-tcx85   1/1     Running     0          50s

# 查看service
[root@master yaml]# kubectl get svc -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.104.11.86   <pending>     80:32637/TCP,443:31430/TCP   80s
ingress-nginx-controller-admission   ClusterIP      10.99.43.141   <none>        443/TCP                      80s

```

## Ingress-nginx使用

ingress可以代理http和https，如果要使用https需要导入证书相关文件到secret，操作如下

```bash
# 创建tls目录并生成私钥和证书
[root@master yaml]# mkdir tls
[root@master tls]# openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/C=CN/ST=QD/L=QD/O=nginx/CN=host.com"
Generating a RSA private key
.....+++++
................................+++++
writing new private key to 'tls.key'
-----
[root@master tls]# ls
tls.crt  tls.key

# 导入到secret
[root@master tls]# kubectl create secret tls tls-secret --key tls.key --cert tls.crt
secret/tls-secret created

# 查看secret
[root@master tls]# kubectl get secret
NAME         TYPE                DATA   AGE
tls-secret   kubernetes.io/tls   2      75s
```



创建Ingress-Basic.yaml，内容如下

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-basic
spec:
  tls:
    - hosts:
      - nginx.host.com
      - apache.host.com
      - tomcat.host.com
      secretName: tls.secret # 指定证书配
  ingressClassName: nginx
  rules:
  - host: "nginx.host.com"
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: ingress-env-nginx-svc
            port:
              number: 80
  - host: "apache.host.com"
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: ingress-env-httpd-svc
            port:
              number: 80
  - host: "tomcat.host.com"
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: ingress-env-tomcat-svc
            port:
              number: 80
```

```bash
# 创建Ingres
[root@master yaml]# kubectl create -f Ingress-Basic.yaml
ingress.networking.k8s.io/ingress-basic created

# 查看Ingress
[root@master yaml]# kubectl get Ingress -n default
NAME            CLASS   HOSTS                                            ADDRESS   PORTS     AGE
ingress-basic   nginx   nginx.host.com,apache.host.com,tomcat.host.com             80, 443   12s


# 查看Ingress详情
[root@master yaml]# kubectl describe Ingress ingress-basic -n default
......
TLS:
  tls.secret terminates apache.host.com,tomcat.host.com
Rules:
  Host             Path  Backends
  ----             ----  --------
  nginx.host.com
                   /   ingress-env-nginx-svc:80 (10.244.52.248:80,10.244.67.124:80,10.244.67.80:80)
  apache.host.com
                   /   ingress-env-httpd-svc:80 (10.244.52.238:80,10.244.67.114:80,10.244.67.75:80)
  tomcat.host.com
                   /   ingress-env-tomcat-svc:80 (10.244.52.229:8080,10.244.67.103:8080,10.244.67.70:8080)
......

# 访问测试
# 当域名[nginx,apache,tomcat].host.com解析到work节点之后去访问即可
# master我没有消除污点也没有配置ingres的容忍所以只能访问work节点
[root@master yaml]# curl -k --tlsv1 https://nginx.host.com
......
<h1>Welcome to nginx!</h1>
......
[root@master yaml]# curl -k --tlsv1 https://apache.host.com
<html><body><h1>It works!</h1></body></html>
[root@master yaml]# curl -k --tlsv1 https://tomcat.host.com
......
                    <h2>If you're seeing this, you've successfully installed Tomcat. Congratulations!</h2>
......
```

## http代理

上面的配置是https的代理，如果要用http的话把tls段全部删掉就可以了