<template>
<div>
  <div class="user-avatar">
    <van-icon name="set" class="header-setting"></van-icon>
    <div class="user-avatar">
      <img :src="avatar" alt="">
      <div class="nickname">{{nickname}}</div>
    </div>
  </div>
</div>
</template>

<script>
import avatar_default from '@/assets/images/avatar_default.png'
export default {
  name: "UserAvatar",
  data(){
    return{
      avatar: avatar_default,
      nickname:'mall',
    }
  }
}
</script>

<style scoped>
.user-avatar {
  height: 130px;
  background-color: #f00000;
}
.header-setting {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: 24px;
}
.user-avatar{
  text-align: center;
}
.user-avatar img{
  margin-top: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
}
.user-avatar .nickname{
  color: white;
  margin-top: 10px;
}
</style>