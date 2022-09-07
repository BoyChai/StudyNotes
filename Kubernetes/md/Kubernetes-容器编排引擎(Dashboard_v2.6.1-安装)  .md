# DashBoard概述

为了提供更丰富的用户体验，kubernetes还开发了一个基于web的用户界面（Dashboard）。用户可以使用Dashboard部署容器化的应用，还可以监控应用的状态，执行故障排查以及管理kubernetes中各种资源。

# DashBoard部署

```bash
# 下载DashBoard的部署资源清单
curl -o Dashboard-Deploy.yaml https://raw.githubusercontent.com/kubernetes/dashboard/v2.6.1/aio/deploy/recommended.yaml

# 修改Dashboard-Deploy.yaml
# 为方便访问，修改如下
# 修改名字为kubernetes-dashboard的Service为NodePod网络模式

kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: NodePort		# 新增
  ports:
    - port: 443			
      targetPort: 8443
      nodePort: 30010	# 新增
  selector:
    k8s-app: kubernetes-dashboard


# 部署
[root@master yaml]# kubectl create -f Dashboard-Deploy.yaml
namespace/kubernetes-dashboard created
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/dashboard-metrics-scraper created

# 查看kubernetes-dashboard命名空间的资源状态
[root@master yaml]# kubectl get pod,svc -n kubernetes-dashboard
NAME                                            READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-8c47d4b5d-dn44t   1/1     Running   0          16s
pod/kubernetes-dashboard-6c75475678-nc75l       1/1     Running   0          16s

NAME                                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.101.132.8     <none>        8000/TCP        16s
service/kubernetes-dashboard        NodePort    10.107.180.253   <none>        443:30010/TCP   16s
```

# DashBoard使用

```bash
# 创建账号
[root@master yaml]# kubectl create serviceaccount dashboard-admin -n kubernetes-dashboard
serviceaccount/dashboard-admin created

# 授权
[root@master yaml]# kubectl create clusterrolebinding dashboard-admin-rb --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin
clusterrolebinding.rbac.authorization.k8s.io/dashboard-admin-rb created

# 创建账号token
# 最好保存一下
[root@master yaml]# kubectl -n kubernetes-dashboard create token dashboard-admin
eyJhbGciOiJSUzI1NiIsImtpZCI6Imp0alA1dHU2MXNTa21ab19OTWNLRDBkc0VKWll3QVhYWmMyeGF6MG55ajgifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjYyNTMwNzQ4LCJpYXQiOjE2NjI1MjcxNDgsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJkYXNoYm9hcmQtYWRtaW4iLCJ1aWQiOiI2MGJiMmEwYy1kMTAxLTRjZjItYjhmMC1lMWJiMmYzNzA0MTgifX0sIm5iZiI6MTY2MjUyNzE0OCwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVybmV0ZXMtZGFzaGJvYXJkOmRhc2hib2FyZC1hZG1pbiJ9.mrwKwkGbehwE8EXUbq1hlg5mpQJP7GAY_m0BFj6nJORYbZ2R4ZtC1RxY72RqKZIDVfA1xQIeAQh-p82iYDgwCGUIx6wvPBe9jsTi1kse-2xLkTjW0OPdORaXRjL3_yQUSVJSFVk9cplZYjac8lkKGdHpD6SCuIZYxfPCUvnHLyQRjpGsRExhZeVGl8gqGDXaTkG50CUzSEEXHfYV5oXSxZa9m3UtFuYR9aoYuamr-5KulfmlGd9UO9t_aer_Kd0db1grcq-m2QqpVPSA-5kYrrOoLBOtIawU-u5-IV82UOoer4twq4B-6numtkcakwAOEs1K0qgcJixx_Ak8nQ1tvw
```

**访问并登录DashBoard**

访问地址为`https://集群主机:30010`

登陆时把上面生成的token粘贴进去即可

![登录](https://image.boychai.xyz/article/Kubernetes_pod_26.png)

![仪表盘](https://image.boychai.xyz/article/Kubernetes_pod_27.png)