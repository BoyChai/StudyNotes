<template>
<div>
  <UserAvatar></UserAvatar>
  <div>
    <van-field
        v-model="username"
        left-icon="username"
        placeholder="请输入用户名"
        clearable>
    </van-field>
    <van-field
        v-model="password"
        left-icon="lock"
        :type="passwdVisible?'text':'password'"
        placeholder="请输入密码"
        :right-icon="password?passwdVisible?'eye-open':'eye-close':''"
        @click-right-icon="passwdVisible=!passwdVisible">
    </van-field>
  </div>
  <div class="clearfix">
    <div class="fl">免费注册</div>
    <div class="fr">忘记密码</div>
  </div>
  <van-button style="width:100%" type="danger" @click="login">登录</van-button>
</div>
</template>

<script>
import UserAvatar from "@/components/UserAvatar.vue";
import {login} from "@/api/api";
import {setToken} from "@/utils/token";
export default {
  components: {UserAvatar},
  name: "login",
  data() {
    return {
      username:"",
      password:"",
      passwdVisible: false
    }
  },
  methods: {
    login() {
      // console.log(this.username+this.password)
      login({username:this.username,password:this.password}).then(resp => {
        if (resp.data.errno == 0) {
          //登录成功
          setToken(resp.data.token);
          //重定向到原目标页面
          console.info(this.$route.query.redirect);
          this.$router.push(this.$route.query.redirect?this.$route.query.redirect:'/user')
        }
      })
    }
  }

}
</script>

<style scoped>

</style>