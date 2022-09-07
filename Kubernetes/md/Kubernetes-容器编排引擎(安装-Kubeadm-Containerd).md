# 准备开始
- 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux 发行版以及一些不提供包管理器的发行版提供通用的指令
- 每台机器 2 GB 或更多的 RAM （如果少于这个数字将会影响你应用的运行内存）
- 2 CPU 核或更多
- 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
- 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。请参见这里了解更多详细信息。
- 开启机器上的某些端口。请参见[这里](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#check-required-ports) 了解更多详细信息。
- 禁用交换分区。为了保证 kubelet 正常工作，你 必须 禁用交换分区。

# 环境
| 主机名             | 系统       | 硬件         | 环境                     |
| --------------- | -------- | ---------- | ---------------------- |
| master.host.com | rocky8.5 | 2核CPU，2G内存 | 关闭selinux和防火墙，可使用主机名通信 |
| work1.host.com  | rocky8.5 | 2核CPU，2G内存 | 关闭selinux和防火墙，可使用主机名通信 |
| work2.host.com  | rocky8.5 | 2核CPU，2G内存 | 关闭selinux和防火墙，可使用主机名通信 |

# 初始化主机
> 一下操作所有主机都做
## 安装配置Containerd
```
curl -o /etc/yum.repos.d/docker.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum -y install containerd.io
containerd config default | sudo tee /etc/containerd/config.toml
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
systemctl enable --now containerd
```
## 关闭SWAP分区
```
sudo swapoff -a
sudo sed -ri 's/.*swap.*/#&/' /etc/fstab
```
## 允许 iptables 检查桥接流量并配置内核转发
```
modprobe  br_netfilter
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sudo sysctl --system
```
## 配置IPVS
> service有基于iptables和基于ipvs两种代理模型。基于ipvs的性能要高一些。需要手动载入才能使用ipvs模块

```
yum install -y ipset ipvsadm
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
chmod +x /etc/sysconfig/modules/ipvs.modules
/bin/bash /etc/sysconfig/modules/ipvs.modules
```
> 如果出现以下**报错**则执行下面内容
> `modprobe: FATAL: Module nf_conntrack_ipv4 not found in directory /lib/modules/4.18.0-348.el8.0.2.x86_64`
```
sed -i 's/nf_conntrack_ipv4/nf_conntrack/g' /etc/sysconfig/modules/ipvs.modules
/bin/bash /etc/sysconfig/modules/ipvs.modules
```
## 安装Kubernetes相关软件工具
```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubelet kubeadm kubectl
systemctl enable --now kubelet
```
# 安装Kubernetes
## MASTER节点
**生成kubeadm配置文件:**`sudo kubeadm config print init-defaults > kubeadm.yaml`
编辑kubeadm.yaml并修改下面内容
```
advertiseAddress: 改成自己的ip
nodeRegistration下的name字段:改成自己的主机名
imageRepository: registry.aliyuncs.com/google_containers
```
**在networking段添加pod的网段:**`podSubnet: 10.244.0.0/16`
修改后内容如下:
```
$ cat kubeadm.yaml
apiVersion: kubeadm.k8s.io/v1beta3
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 192.168.0.109
  bindPort: 6443
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  name: master.host.com
  taints: null
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta3
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: registry.aliyuncs.com/google_containers
kind: ClusterConfiguration
kubernetesVersion: 1.24.0
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
  podSubnet: 10.244.0.0/16
scheduler: {}
```
**下载Kubernetes所需镜像:**
```
$ kubeadm config --config kubeadm.yaml images pull
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-apiserver:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-controller-manager:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-scheduler:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-proxy:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/pause:3.7
[config/images] Pulled registry.aliyuncs.com/google_containers/etcd:3.5.3-0
[config/images] Pulled registry.aliyuncs.com/google_containers/coredns:v1.8.6
```
在意一下pause镜像的的版本名称我这里是`registry.aliyuncs.com/google_containers/pause:3.7`
修改containerd的配置文件/etc/containerd/config.toml,把里面的sandbox_image的值改为pause镜像的全称加版本
```
$ cat /etc/containerd/config.toml |grep sandbox
sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.7"
```
**重启Containerd:**`systemctl restart containerd`
**初始化master节点:**`kubeadm init --config kubeadm.yaml`
初始化成功之后会打印下面的内容
```

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.0.4:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:91b1d4502e8950ece37fbc591160007f5e2a3311ff0ebe05112d24851ca082a9
```
其中下面内容需要自己去执行
```
o start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

```
之后这段内容是加入集群的命令,work节点可以通过下面命令来加入集群
```
Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.0.4:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:91b1d4502e8950ece37fbc591160007f5e2a3311ff0ebe05112d24851ca082a9

```
## WORK节点
WORK节点执行master节点返回的加入集群命令加入集群,出现下面内容即加入成功
```
kubeadm join 192.168.0.4:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:91b1d4502e8950ece37fbc591160007f5e2a3311ff0ebe05112d24851ca082a9

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.

```
## 网络插件Calico
选择网络插件可参考[官方文档](https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)进行选择本文选用Calico网络插件
在master节点下载calico的yaml文件
curl https://projectcalico.docs.tigera.io/archive/v3.22/manifests/calico.yaml -O
找到下面两行内容进行取消注释并修改value值
```
# - name: CALICO_IPV4POOL_CIDR
#   value: "192.168.0.0/16"
```
value值应为开始创建master节点时的pod网络`10.244.0.0/16`,修改后为
```
# - name: CALICO_IPV4POOL_CIDR
#   value: "10.244.0.0/16"
```
之后进行创建，创建方法如下
```
$ sudu kubectl apply -f calico.yaml
configmap/calico-config unchanged
customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org configured
customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org configured
clusterrole.rbac.authorization.k8s.io/calico-kube-controllers unchanged
clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers unchanged
clusterrole.rbac.authorization.k8s.io/calico-node unchanged
clusterrolebinding.rbac.authorization.k8s.io/calico-node unchanged
daemonset.apps/calico-node created
serviceaccount/calico-node created
deployment.apps/calico-kube-controllers created
serviceaccount/calico-kube-controllers created
Warning: policy/v1beta1 PodDisruptionBudget is deprecated in v1.21+, unavailable in v1.25+; use policy/v1 PodDisruptionBudget
poddisruptionbudget.policy/calico-kube-controllers created
```
执行完成没有报错之后可以运行`kubectl get node`来查看节点的联通状态,当`STATUS`全都变成Ready即部署成功
```
$ kubectl get node
NAME             STATUS   ROLES           AGE   VERSION
master.host.com           Ready    control-plane   43m   v1.24.3
work1.host.com   Ready    <none>          39m   v1.24.3
work2.host.com   Ready    <none>          39m   v1.24.3
```
# 其他
## 加入集群
刚创建好的集群生成的加入命令只会存在24小时，24小时过后新主机想要加入集群则需要重新生成一个token加入。具体方法如下
**创建token:**`kubeadm token create`

**获取CA公钥哈希值:**openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^ .* //'
有了上面的两个值就可以通过一下命令进行加入集群
```
kubeadm join master:6443 --token 新生成的Token填写此处 --discovery-token-ca-cert-hash sha256:获取的公钥哈希值填写此处
```
## 以master的身份加入集群
在master节点输入命令`kubectl -n kube-system edit cm kubeadm-config`
在ClusterConfiguration段下面添加以下内容`controlPlaneEndpoint: "master主机IP:6443"`,效果如下:
```
apiVersion: v1
data:
  ClusterConfiguration: |
    apiServer:
      extraArgs:
        authorization-mode: Node,RBAC
      timeoutForControlPlane: 4m0s
    apiVersion: kubeadm.k8s.io/v1beta3
    certificatesDir: /etc/kubernetes/pki
    clusterName: kubernetes
    controllerManager: {}
    dns: {}
    etcd:
      local:
        dataDir: /var/lib/etcd
    imageRepository: registry.aliyuncs.com/google_containers
    kind: ClusterConfiguration
    kubernetesVersion: v1.24.0
    controlPlaneEndpoint: "192.168.0.2:6443"
    networking:
      dnsDomain: cluster.local
      podSubnet: 10.244.0.0/16
      serviceSubnet: 10.96.0.0/12
    scheduler: {}
kind: ConfigMap
metadata:
  creationTimestamp: "2022-08-01T13:53:50Z"
  name: kubeadm-config
  namespace: kube-system
  resourceVersion: "1741"
  uid: 039cbe0d-ec66-4ff6-8d8e-84fe94162d89
```
通过命令`kubeadm init phase upload-certs --upload-certs`来创建证书密钥
只后获取一个token和CA公钥哈希值执行下面命令
```
kubeadm join master主机IP:6443 --token 新生成的Token --discovery-token-ca-cert-hash sha256:获取的公钥哈希值填写此处 --control-plane --certificate-key 证书密钥写此处
```
PS:新master节点也会去pull镜像,默认会从国外网站去下载会导致很慢甚至加入失败,解决办法就是使用国内的镜像地址去下载镜像,例如这条命令`kubeadm config images pull --image-repository registry.aliyuncs.com/google_containers`
## master部署pod
默认master节点是不会部署pod的都会分配给work节点干活，如果想要master节点也部署pod则可以使用下面的命令
```
kubectl taint nodes --all node-role.kubernetes.io/master-
```
## 证书更新
kubeadm安装的kubernetes默认证书只有一年的有效期,更新版本或者手动更新证书就会再更新一年，证书相关操作如下
**查看证书有效期: **`kubeadm certs check-expiration`
**升级证书: **`kubeadm certs renew all`
# 问题
> 出现报错以及问题欢迎在评论区讨论

