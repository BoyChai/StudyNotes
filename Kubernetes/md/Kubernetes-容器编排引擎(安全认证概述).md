# 访问控制

## 概述

Kubernetes作为一个分布式集群的管理工具，保证集群的安全性是其一个重要的任务。所谓的安全性其实就是保证对Kubernetes的各种**客户端**进行**认证和鉴权**操作。

## 客户端

在Kubernetes集群中，客户端通常有两类：

- **User Account**：一般是独立于kubernetes之外的其他服务管理的用户账号。

- **Service Account**：kubernetes管理的账号，用于为Pod中的服务进程在访问Kubernetes时提供身份标识。

![客户端](https://image.boychai.xyz/article/Kubernetes_pod_23.png)

## 认证、授权与准入控制

ApiServer是访问及管理资源对象的唯一入口。任何一个请求访问ApiServer，都要经过下面三个流程：

- Authentication（认证）：身份鉴别，只有正确的账号才能够通过认证
- Authorization（授权）：  判断用户是否有权限对访问的资源执行特定的动作
- Admission Control（准入控制）：用于补充授权机制以实现更加精细的访问控制功能。

![请求流程](https://image.boychai.xyz/article/Kubernetes_pod_24.png)

# 认证方式

Kubernetes集群安全的最关键点在于如何识别并认证客户端身份，它提供了3种客户端身份认证方式：

- HTTP Base认证：通过用户名+密码的方式认证

  ~~~markdown
  这种认证方式是把“用户名:密码”用BASE64算法进行编码后的字符串放在HTTP请求中的Header Authorization域里发送给服务端。服务端收到后进行解码，获取用户名及密码，然后进行用户身份认证的过程。
  ~~~

- HTTP Token认证：通过一个Token来识别合法用户

  ~~~markdown
  这种认证方式是用一个很长的难以被模仿的字符串--Token来表明客户身份的一种方式。每个Token对应一个用户名，当客户端发起API调用请求时，需要在HTTP Header里放入Token，API Server接到Token后会跟服务器中保存的token进行比对，然后进行用户身份认证的过程。
  ~~~

- HTTPS证书认证：基于CA根证书签名的双向数字证书认证方式

  ~~~markdown
  这种认证方式是安全性最高的一种方式，但是同时也是操作起来最麻烦的一种方式。
  ~~~

![证书认证](https://image.boychai.xyz/article/Kubernetes_pod_25.png)

1. 证书申请和下发

   ~~~markdown
     HTTPS通信双方的服务器向CA机构申请证书，CA机构下发根证书、服务端证书及私钥给申请者
   ~~~

2. 客户端和服务端的双向认证

   ~~~markdown
     1> 客户端向服务器端发起请求，服务端下发自己的证书给客户端，
        客户端接收到证书后，通过私钥解密证书，在证书中获得服务端的公钥，
        客户端利用服务器端的公钥认证证书中的信息，如果一致，则认可这个服务器
     2> 客户端发送自己的证书给服务器端，服务端接收到证书后，通过私钥解密证书，
        在证书中获得客户端的公钥，并用该公钥认证证书信息，确认客户端是否合法
   ~~~

3. 服务器端和客户端进行通信

   ~~~markdown
     服务器端和客户端协商好加密方案后，客户端会产生一个随机的秘钥并加密，然后发送到服务器端。
     服务器端接收这个秘钥后，双方接下来通信的所有内容都通过该随机秘钥加密
   ~~~

> 注意:  Kubernetes允许同时配置多种认证方式，只要其中任意一个方式认证通过即可



